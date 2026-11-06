import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type {
  ErrorDetailResponseDto,
  ErrorResponseDto,
} from '../types/error-response';

interface NestErrorBody {
  readonly code?: string;
  readonly details?: readonly ErrorDetailResponseDto[];
  readonly message?: string | readonly string[];
}

function isNestErrorBody(value: unknown): value is NestErrorBody {
  return typeof value === 'object' && value !== null;
}

function isErrorDetail(value: unknown): value is ErrorDetailResponseDto {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof value.code === 'string' &&
    (!('field' in value) || typeof value.field === 'string')
  );
}

function detailsFromBody(body: unknown): readonly ErrorDetailResponseDto[] {
  if (!isNestErrorBody(body) || !Array.isArray(body.details)) return [];
  return body.details.filter(isErrorDetail);
}

function publicMessage(status: number, body: unknown): string {
  if (status >= 500) {
    return status === 503
      ? 'Service temporarily unavailable.'
      : 'An unexpected error occurred.';
  }

  if (isNestErrorBody(body)) {
    if (typeof body.message === 'string') return body.message;
  }
  return 'Request failed.';
}

function errorCode(status: number): string {
  const names: Readonly<Record<number, string>> = {
    [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
    [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
    [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
    [HttpStatus.NOT_FOUND]: 'RESOURCE_NOT_FOUND',
    [HttpStatus.METHOD_NOT_ALLOWED]: 'METHOD_NOT_ALLOWED',
    [HttpStatus.CONFLICT]: 'CONFLICT',
    [HttpStatus.PAYLOAD_TOO_LARGE]: 'PAYLOAD_TOO_LARGE',
    [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: 'UNSUPPORTED_MEDIA_TYPE',
    [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
    [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
    [HttpStatus.BAD_GATEWAY]: 'UPSTREAM_SERVICE_ERROR',
    [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_NOT_READY',
    [HttpStatus.GATEWAY_TIMEOUT]: 'UPSTREAM_TIMEOUT',
  };
  return names[status] ?? (status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_FAILED');
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const code =
      isNestErrorBody(body) && typeof body.code === 'string'
        ? body.code
        : errorCode(status);

    const payload: ErrorResponseDto = {
      error: {
        code,
        message: publicMessage(status, body),
        requestId: request.requestId,
        details: detailsFromBody(body),
      },
    };

    response.status(status).json(payload);
  }
}
