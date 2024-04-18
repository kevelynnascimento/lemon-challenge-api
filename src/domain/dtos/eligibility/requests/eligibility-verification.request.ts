import { ConsumptionClassificationEnum } from '../../../enums/consumption-classification.enum';
import { ConnectionTypeEnum } from '../../../enums/connection-type.enum';
import { TaxModalityEnum } from '../../../enums/tax-modality.enum';

export default interface EligibilityVerificationRequest {
  documentNumber: string;
  connectionType: ConnectionTypeEnum;
  consumptionClassification: ConsumptionClassificationEnum;
  taxModality: TaxModalityEnum;
  historyItems: number[];
}
