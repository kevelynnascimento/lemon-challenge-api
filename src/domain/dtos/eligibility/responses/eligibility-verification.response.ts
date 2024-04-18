export default interface EligibilityVerificationResponse {
  eligible: boolean;
  annualCO2EmissionSavings: number | null;
  ineligibilityReasons: string[];
}
