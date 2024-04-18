import * as bodyParser from 'body-parser';
import cors from 'cors';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { HttpErrorMiddleware } from '../middlewares/http-error.middleware';

export class ServerConfig {
  public static configure(container: Container) {
    const server = new InversifyExpressServer(container, null, {
      rootPath: '/api',
    });

    server.setConfig((app) => {
      app.use(cors());
      app.use(
        bodyParser.urlencoded({
          extended: true,
        }),
      );
      app.use(bodyParser.json());
    });

    server.setErrorConfig((app) => {
      app.use(HttpErrorMiddleware.handle);
    });

    return server;
  }
}
