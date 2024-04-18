import { EligibilityService } from '../domain/services/eligibility.service';
import { inject } from 'inversify';
import {
  BaseHttpController,
  IHttpActionResult,
  controller,
  httpPost,
  requestBody,
} from 'inversify-express-utils';
import EligibilityVerificationRequest from '../domain/dtos/eligibility/requests/eligibility-verification.request';

@controller('/eligibility')
export class EligibilityController extends BaseHttpController {
  constructor(
    @inject(EligibilityService)
    private readonly eligibilityService: EligibilityService,
  ) {
    super();
  }

  @httpPost('/verification')
  public async verify(
    @requestBody() request: EligibilityVerificationRequest,
  ): Promise<IHttpActionResult> {
    const response = await this.eligibilityService.verify(request);
    return this.json(response, 200);
  }
}
