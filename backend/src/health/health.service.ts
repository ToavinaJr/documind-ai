import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface DatabaseHealthChecker {
  checkConnection(): Promise<void>;
}

export interface LiveHealth {
  readonly data: {
    readonly status: 'ok';
    readonly service: 'documind-api';
    readonly timestamp: string;
  };
}

export interface ReadyHealth {
  readonly data: {
    readonly status: 'ready';
    readonly checks: { readonly database: 'up' };
    readonly timestamp: string;
  };
}

@Injectable()
export class HealthService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: DatabaseHealthChecker,
  ) {}

  live(): LiveHealth {
    return {
      data: {
        status: 'ok',
        service: 'documind-api',
        timestamp: new Date().toISOString(),
      },
    };
  }

  async ready(): Promise<ReadyHealth> {
    try {
      await this.prisma.checkConnection();
    } catch {
      throw new ServiceUnavailableException();
    }

    return {
      data: {
        status: 'ready',
        checks: { database: 'up' },
        timestamp: new Date().toISOString(),
      },
    };
  }
}
