import { injectable } from 'inversify';
import { HttpBadRequestError } from '../../infrastructure/exceptions/http-bad-request.error';
import EligibilityVerificationResponse from '../dtos/eligibility/responses/eligibility-verification.response';
import EligibilityVerificationRequest from '../dtos/eligibility/requests/eligibility-verification.request';
import EnumValidator from '../../infrastructure/validators/enum.validator';
import { ConnectionTypeEnum } from '../enums/connection-type.enum';
import { TaxModalityEnum } from '../enums/tax-modality.enum';
import { ConsumptionClassificationEnum } from '../enums/consumption-classification.enum';
import DocumentValidator from '../../infrastructure/validators/document.validator';

@injectable()
export class EligibilityService {
  public async verify(
    request: EligibilityVerificationRequest,
  ): Promise<EligibilityVerificationResponse> {
    const { historyItems } = request;

    this.validateRequest(request);

    const average = this.calculateAverage(historyItems);

    const { eligible, ineligibilityReasons } = this.checkEligibility(
      request,
      average,
    );

    const annualCO2EmissionSavings = eligible
      ? this.calculateAnnualCO2EmissionSavings(average)
      : null;

    const response = {
      eligible,
      ineligibilityReasons,
      annualCO2EmissionSavings: annualCO2EmissionSavings,
    };

    return response;
  }

  private checkEligibility(
    request: EligibilityVerificationRequest,
    average: number,
  ) {
    let eligible = true;

    const ineligibilityReasons = [];

    const { consumptionClassification, taxModality, connectionType } = request;

    if (
      !(
        consumptionClassification ===
          ConsumptionClassificationEnum.Commercial ||
        consumptionClassification ===
          ConsumptionClassificationEnum.Residential ||
        consumptionClassification === ConsumptionClassificationEnum.Industrial
      )
    ) {
      eligible = false;
      ineligibilityReasons.push('Classe de consumo não aceita');
    }

    if (
      !(
        taxModality === TaxModalityEnum.Conventional ||
        taxModality === TaxModalityEnum.White
      )
    ) {
      eligible = false;
      ineligibilityReasons.push('Modalidade tarifária não aceita');
    }

    const minimumConsumption = this.getMinimumConsumptionValue(connectionType);

    if (average < minimumConsumption) {
      eligible = false;
      ineligibilityReasons.push('Consumo muito baixo para o tipo de conexão');
    }
    return { eligible, ineligibilityReasons };
  }

  private validateRequest(request: EligibilityVerificationRequest) {
    const {
      connectionType,
      consumptionClassification,
      taxModality,
      documentNumber,
      historyItems,
    } = request;

    if (!EnumValidator.isValid(ConnectionTypeEnum, connectionType)) {
      throw new HttpBadRequestError('Connection type is not valid.');
    }

    if (
      !EnumValidator.isValid(
        ConsumptionClassificationEnum,
        consumptionClassification,
      )
    ) {
      throw new HttpBadRequestError('Consumption classification is not valid.');
    }

    if (!EnumValidator.isValid(TaxModalityEnum, taxModality)) {
      throw new HttpBadRequestError('Tax modality is not valid.');
    }

    if (!DocumentValidator.isValid(documentNumber)) {
      throw new HttpBadRequestError('Document number is not valid.');
    }

    if (historyItems?.length < 3 || historyItems?.length > 12) {
      throw new HttpBadRequestError('History items are not valid.');
    }
  }

  private calculateAverage(values: number[]): number {
    const totalValue = values.reduce((total, value) => total + value, 0);

    const average = totalValue / values.length;

    return average;
  }

  private calculateAnnualCO2EmissionSavings(average: number): number {
    const annualProjection = average * 12;

    const annualCO2EmissionSavings = (84 * annualProjection) / 1000;

    return annualCO2EmissionSavings;
  }

  private getMinimumConsumptionValue(connectionType: ConnectionTypeEnum) {
    switch (connectionType) {
      case ConnectionTypeEnum.SinglePhase:
        return 400;
      case ConnectionTypeEnum.Biphasic:
        return 500;
      case ConnectionTypeEnum.ThreePhase:
        return 750;
    }
  }
}
