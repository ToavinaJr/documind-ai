import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/types/error-response';
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
  @ApiNotFoundResponse({
    description: 'The requested route does not exist.',
    type: ErrorResponseDto,
  })
  live(): LiveHealth {
    return this.healthService.live();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Check whether the API and database are ready' })
  @ApiOkResponse({ description: 'The API and database are ready.' })
  @ApiNotFoundResponse({
    description: 'The requested route does not exist.',
    type: ErrorResponseDto,
  })
  @ApiServiceUnavailableResponse({
    description: 'A dependency is unavailable.',
    type: ErrorResponseDto,
  })
  ready(): Promise<ReadyHealth> {
    return this.healthService.ready();
  }
}
