import 'reflect-metadata';
import { EligibilityService } from './eligibility.service';
import { HttpBadRequestError } from '../../infrastructure/exceptions/http-bad-request.error';
import { ConnectionTypeEnum } from '../enums/connection-type.enum';
import { TaxModalityEnum } from '../enums/tax-modality.enum';
import { ConsumptionClassificationEnum } from '../enums/consumption-classification.enum';
import EligibilityVerificationRequest from '../dtos/eligibility/requests/eligibility-verification.request';
import { ContainerConfig } from '../../infrastructure/configs/container.config';

describe('EligibilityService', () => {
  let eligibilityService: EligibilityService;

  beforeEach(() => {
    ContainerConfig.start();
    eligibilityService = new EligibilityService();
  });

  describe('verify', () => {
    it('should return eligibility true with valid input as single phase', async () => {
      const request: EligibilityVerificationRequest = {
        connectionType: ConnectionTypeEnum.SinglePhase,
        consumptionClassification: ConsumptionClassificationEnum.Commercial,
        taxModality: TaxModalityEnum.Conventional,
        documentNumber: '14041737706',
        historyItems: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      };

      const response = await eligibilityService.verify(request);

      expect(response.eligible).toBe(true);
      expect(response.ineligibilityReasons).toHaveLength(0);
      expect(response.annualCO2EmissionSavings).not.toBeNull();
    });

    it('should return eligibility true with valid input as biphasic', async () => {
      const request: EligibilityVerificationRequest = {
        connectionType: ConnectionTypeEnum.Biphasic,
        consumptionClassification: ConsumptionClassificationEnum.Commercial,
        taxModality: TaxModalityEnum.Conventional,
        documentNumber: '14041737706',
        historyItems: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      };

      const response = await eligibilityService.verify(request);

      expect(response.eligible).toBe(true);
      expect(response.ineligibilityReasons).toHaveLength(0);
      expect(response.annualCO2EmissionSavings).not.toBeNull();
    });

    it('should return eligibility true with valid input as three phase', async () => {
      const request: EligibilityVerificationRequest = {
        connectionType: ConnectionTypeEnum.ThreePhase,
        consumptionClassification: ConsumptionClassificationEnum.Commercial,
        taxModality: TaxModalityEnum.Conventional,
        documentNumber: '14041737706',
        historyItems: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      };

      const response = await eligibilityService.verify(request);

      expect(response.eligible).toBe(true);
      expect(response.ineligibilityReasons).toHaveLength(0);
      expect(response.annualCO2EmissionSavings).not.toBeNull();
    });

    it('should return eligibility false when consumption classification is not eligible', async () => {
      const request: EligibilityVerificationRequest = {
        connectionType: ConnectionTypeEnum.SinglePhase,
        consumptionClassification: ConsumptionClassificationEnum.Rural,
        taxModality: TaxModalityEnum.Conventional,
        documentNumber: '14041737706',
        historyItems: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
        ],
      };

      const response = await eligibilityService.verify(request);

      expect(response.eligible).toBe(false);
      expect(response.ineligibilityReasons).toEqual(
        expect.arrayContaining(['Classe de consumo não aceita']),
      );
      expect(response.annualCO2EmissionSavings).toBeNull();
    });

    it('should return eligibility false when tax modality is not eligible', async () => {
      const request: EligibilityVerificationRequest = {
        connectionType: ConnectionTypeEnum.SinglePhase,
        consumptionClassification: ConsumptionClassificationEnum.Rural,
        taxModality: TaxModalityEnum.Green,
        documentNumber: '14041737706',
        historyItems: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
        ],
      };

      const response = await eligibilityService.verify(request);

      expect(response.eligible).toBe(false);
      expect(response.ineligibilityReasons).toEqual(
        expect.arrayContaining(['Modalidade tarifária não aceita']),
      );
      expect(response.annualCO2EmissionSavings).toBeNull();
    });

    it('should return eligibility false when the consumption is lower than expected', async () => {
      const request: EligibilityVerificationRequest = {
        connectionType: ConnectionTypeEnum.SinglePhase,
        consumptionClassification: ConsumptionClassificationEnum.Rural,
        taxModality: TaxModalityEnum.Conventional,
        documentNumber: '14041737706',
        historyItems: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      };

      const response = await eligibilityService.verify(request);

      expect(response.eligible).toBe(false);
      expect(response.ineligibilityReasons).toEqual(
        expect.arrayContaining(['Consumo muito baixo para o tipo de conexão']),
      );
      expect(response.annualCO2EmissionSavings).toBeNull();
    });

    // excecoes OK
    it('should throw HttpBadRequestError when connection type is not valid', async () => {
      const request = {
        connectionType: 'error',
        consumptionClassification: ConsumptionClassificationEnum.Rural,
        taxModality: TaxModalityEnum.Green,
        documentNumber: '14041737706',
        historyItems: [],
      };

      await expect(
        eligibilityService.verify(request as EligibilityVerificationRequest),
      ).rejects.toThrow(HttpBadRequestError);
    });

    it('should throw HttpBadRequestError when consumptio classification is not valid', async () => {
      const request = {
        connectionType: ConnectionTypeEnum.SinglePhase,
        consumptionClassification: 'error',
        taxModality: TaxModalityEnum.Green,
        documentNumber: '14041737706',
        historyItems: [],
      };

      await expect(
        eligibilityService.verify(request as EligibilityVerificationRequest),
      ).rejects.toThrow(HttpBadRequestError);
    });

    it('should throw HttpBadRequestError when tax modality is not valid', async () => {
      const request = {
        connectionType: ConnectionTypeEnum.SinglePhase,
        consumptionClassification: ConsumptionClassificationEnum.Rural,
        taxModality: 'error',
        documentNumber: '14041737706',
        historyItems: [],
      };

      await expect(
        eligibilityService.verify(request as EligibilityVerificationRequest),
      ).rejects.toThrow(HttpBadRequestError);
    });

    it('should throw HttpBadRequestError when document number is not valid', async () => {
      const request = {
        connectionType: ConnectionTypeEnum.SinglePhase,
        consumptionClassification: ConsumptionClassificationEnum.Rural,
        taxModality: TaxModalityEnum.Green,
        documentNumber: '000',
        historyItems: [],
      };

      await expect(
        eligibilityService.verify(request as EligibilityVerificationRequest),
      ).rejects.toThrow(HttpBadRequestError);
    });

    it('should throw HttpBadRequestError when history items are not valid', async () => {
      const request = {
        connectionType: ConnectionTypeEnum.SinglePhase,
        consumptionClassification: ConsumptionClassificationEnum.Rural,
        taxModality: TaxModalityEnum.Green,
        documentNumber: '14041737706',
        historyItems: [],
      };

      await expect(
        eligibilityService.verify(request as EligibilityVerificationRequest),
      ).rejects.toThrow(HttpBadRequestError);
    });
  });
});
