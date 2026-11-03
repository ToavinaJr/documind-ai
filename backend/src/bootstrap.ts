import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { loadEnvironment, type Environment } from './config/environment';

export async function createApplication(
  environment: Environment = loadEnvironment(),
): Promise<INestApplication> {
  const application = await NestFactory.create(AppModule);

  application.setGlobalPrefix('api/v1');
  application.use(helmet());
  application.enableCors({
    origin: [...environment.corsOrigins],
    credentials: true,
  });
  application.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  application.useGlobalFilters(new HttpExceptionFilter());
  application.enableShutdownHooks();

  if (environment.nodeEnv !== 'production') {
    const document = SwaggerModule.createDocument(
      application,
      new DocumentBuilder()
        .setTitle('DocuMind AI API')
        .setDescription('Technical foundation endpoints for DocuMind AI.')
        .setVersion('0.1.0')
        .build(),
    );
    SwaggerModule.setup('api/docs', application, document);
  }

  return application;
}
