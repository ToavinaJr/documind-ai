import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import type { INestApplication } from '@nestjs/common';
import { createApplication } from '../src/bootstrap';
import { loadEnvironment } from '../src/config/environment';

const testEnvironment = loadEnvironment({
  NODE_ENV: 'test',
  API_HOST: '127.0.0.1',
  API_PORT: '3001',
  CORS_ORIGINS: 'http://localhost:3000',
  DATABASE_URL:
    process.env.TEST_DATABASE_URL ??
    'postgresql://documind_app:local-development-password@localhost:62962/documind?schema=public',
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

describe('API health endpoints', () => {
  let application: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = testEnvironment.databaseUrl;
    process.env.CORS_ORIGINS = testEnvironment.corsOrigins.join(',');
    process.env.NODE_ENV = testEnvironment.nodeEnv;
    application = await createApplication(testEnvironment);
    await application.listen(0, testEnvironment.apiHost);
    baseUrl = await application.getUrl();
  });

  afterAll(async () => {
    await application.close();
  });

  it('returns liveness without depending on PostgreSQL', async () => {
    const response = await fetch(`${baseUrl}/api/v1/health/live`);
    expect(response.status).toBe(200);
    const body: unknown = await response.json();
    if (!isRecord(body) || !isRecord(body.data)) {
      throw new Error('Liveness response does not contain a data object.');
    }
    expect(body.data.status).toBe('ok');
  });

  it('returns readiness when PostgreSQL is available', async () => {
    const response = await fetch(`${baseUrl}/api/v1/health/ready`);
    expect(response.status).toBe(200);
  });

  it('normalizes unknown routes and preserves a valid request ID', async () => {
    const response = await fetch(`${baseUrl}/api/v1/missing`, {
      headers: { 'x-request-id': 'req_e2e-test' },
    });
    expect(response.status).toBe(404);
    expect(response.headers.get('x-request-id')).toBe('req_e2e-test');
    const body: unknown = await response.json();
    if (!isRecord(body) || !isRecord(body.error)) {
      throw new Error('Error response does not contain an error object.');
    }
    expect(body.error.code).toBe('RESOURCE_NOT_FOUND');
    expect(body.error.requestId).toBe('req_e2e-test');
  });
});
