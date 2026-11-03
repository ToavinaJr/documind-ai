export type NodeEnvironment = 'development' | 'test' | 'production';

export interface Environment {
  readonly nodeEnv: NodeEnvironment;
  readonly apiHost: string;
  readonly apiPort: number;
  readonly corsOrigins: readonly string[];
  readonly databaseUrl: string;
}

function requireValue(
  source: NodeJS.ProcessEnv,
  name: string,
): string {
  const value = source[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseNodeEnvironment(value: string): NodeEnvironment {
  switch (value) {
    case 'development':
    case 'test':
    case 'production':
      return value;
    default:
      throw new Error('NODE_ENV must be development, test, or production.');
  }
}

function parsePort(value: string): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('API_PORT must be an integer between 1 and 65535.');
  }
  return port;
}

function parseDatabaseUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL.');
  }

  if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') {
    throw new Error('DATABASE_URL must use the PostgreSQL protocol.');
  }
  return value;
}

function parseCorsOrigins(value: string): readonly string[] {
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('CORS_ORIGINS must contain at least one origin.');
  }

  for (const origin of origins) {
    const url = new URL(origin);
    if (url.origin !== origin || !['http:', 'https:'].includes(url.protocol)) {
      throw new Error(`Invalid CORS origin: ${origin}`);
    }
  }

  return origins;
}

export function loadEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): Environment {
  return {
    nodeEnv: parseNodeEnvironment(source.NODE_ENV?.trim() || 'development'),
    apiHost: source.API_HOST?.trim() || '0.0.0.0',
    apiPort: parsePort(source.API_PORT?.trim() || '3001'),
    corsOrigins: parseCorsOrigins(requireValue(source, 'CORS_ORIGINS')),
    databaseUrl: parseDatabaseUrl(requireValue(source, 'DATABASE_URL')),
  };
}
