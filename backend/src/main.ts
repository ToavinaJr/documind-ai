import 'dotenv/config';
import 'reflect-metadata';

import { createApplication } from './bootstrap';
import { loadEnvironment } from './config/environment';

async function bootstrap(): Promise<void> {
  const environment = loadEnvironment();
  const application = await createApplication(environment);

  await application.listen(environment.apiPort, environment.apiHost);
}

void bootstrap();