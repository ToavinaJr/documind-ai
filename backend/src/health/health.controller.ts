import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  HealthService,
  type LiveHealth,
  type ReadyHealth,
} from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @ApiOperation({ summary: 'Check whether the API process is alive' })
  @ApiOkResponse({ description: 'The API process is alive.' })
  live(): LiveHealth {
    return this.healthService.live();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Check whether the API and database are ready' })
  @ApiOkResponse({ description: 'The API and database are ready.' })
  @ApiServiceUnavailableResponse({ description: 'A dependency is unavailable.' })
  ready(): Promise<ReadyHealth> {
    return this.healthService.ready();
  }
}
