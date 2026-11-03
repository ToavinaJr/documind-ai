import { describe, expect, it } from 'bun:test';
import { loadEnvironment } from './environment';

const databaseUrl = 'postgresql://user:password@localhost:5432/documind';

const validEnvironment: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  API_HOST: '127.0.0.1',
  API_PORT: '3001',
  CORS_ORIGINS: 'http://localhost:3000',
  DATABASE_URL: databaseUrl,
};

describe('loadEnvironment', () => {
  it('loads a valid environment', () => {
    expect(loadEnvironment(validEnvironment)).toEqual({
      nodeEnv: 'test',
      apiHost: '127.0.0.1',
      apiPort: 3001,
      corsOrigins: ['http://localhost:3000'],
      databaseUrl,
    });
  });

  it('rejects a missing database URL', () => {
    const source = { ...validEnvironment, DATABASE_URL: undefined };
    expect(() => loadEnvironment(source)).toThrow(
      'Missing required environment variable: DATABASE_URL',
    );
  });

  it('rejects an invalid port', () => {
    expect(() =>
      loadEnvironment({ ...validEnvironment, API_PORT: '70000' }),
    ).toThrow('API_PORT must be an integer between 1 and 65535.');
  });

  it('rejects a non-PostgreSQL database URL', () => {
    expect(() =>
      loadEnvironment({
        ...validEnvironment,
        DATABASE_URL: 'mysql://user:password@localhost:3306/documind',
      }),
    ).toThrow('DATABASE_URL must use the PostgreSQL protocol.');
  });
});
