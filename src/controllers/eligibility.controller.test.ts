import 'reflect-metadata';
import request from 'supertest';
import { Application } from 'express';
import { Bootstraper } from '..';

describe('EligibilityController', () => {
  let app: Application;

  beforeAll(async () => {
    app = await Bootstraper.start();
  });

  describe('POST /eligibility/verification', () => {
    it('should return eligibility true with expected data', async () => {
      const body = {
        documentNumber: '14041737706',
        connectionType: 'bifasico',
        consumptionClassification: 'comercial',
        taxModality: 'convencional',
        historyItems: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      };

      const response = await request(app)
        .post('/api/eligibility/verification')
        .send(body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        eligible: true,
        ineligibilityReasons: [],
        annualCO2EmissionSavings: 5553.24,
      });
    });

    it('should return eligibility false with expected data', async () => {
      const body = {
        documentNumber: '14041737706',
        connectionType: 'bifasico',
        consumptionClassification: 'rural',
        taxModality: 'verde',
        historyItems: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
        ],
      };

      const response = await request(app)
        .post('/api/eligibility/verification')
        .send(body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        eligible: false,
        ineligibilityReasons: [
          'Classe de consumo não aceita',
          'Modalidade tarifária não aceita',
        ],
        annualCO2EmissionSavings: null,
      });
    });
  });
});
