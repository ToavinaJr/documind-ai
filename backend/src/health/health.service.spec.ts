import { describe, expect, it } from 'bun:test';
import { ServiceUnavailableException } from '@nestjs/common';
import {
  HealthService,
  type DatabaseHealthChecker,
} from './health.service';

describe('HealthService', () => {
  it('reports liveness without querying the database', () => {
    const prisma: DatabaseHealthChecker = {
      checkConnection: () => Promise.reject(new Error('not used')),
    };
    const result = new HealthService(prisma).live();
    expect(result.data.status).toBe('ok');
    expect(result.data.service).toBe('documind-api');
  });

  it('reports readiness when PostgreSQL responds', async () => {
    const prisma: DatabaseHealthChecker = {
      checkConnection: () => Promise.resolve(),
    };
    const result = await new HealthService(prisma).ready();
    expect(result.data.checks.database).toBe('up');
  });

  it('hides database errors behind a service unavailable response', async () => {
    const prisma: DatabaseHealthChecker = {
      checkConnection: () => Promise.reject(new Error('secret connection data')),
    };
    let caught: unknown;
    try {
      await new HealthService(prisma).ready();
    } catch (error: unknown) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(ServiceUnavailableException);
  });
});
