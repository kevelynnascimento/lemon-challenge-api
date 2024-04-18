import { Container } from 'inversify';
import { EligibilityService } from '../../domain/services/eligibility.service';
import { EligibilityController } from '../../controllers/eligibility.controller';

export class ContainerConfig {
  private static container: Container;

  public static start(): Container {
    this.container = new Container();

    this.configureServices();
    this.configureControllers();

    return this.container;
  }

  private static configureServices(): void {
    this.container.bind<EligibilityService>(EligibilityService).toSelf();
  }

  private static configureControllers(): void {
    this.container.bind<EligibilityController>(EligibilityController).toSelf();
  }
}
