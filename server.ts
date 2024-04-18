import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { Bootstraper } from './src';

dotenv.config();

(async () => {
  const app = await Bootstraper.start();

  const port = process.env.PORT ?? 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
})();
