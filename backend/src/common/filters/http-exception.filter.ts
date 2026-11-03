import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ErrorDetail, ErrorResponse } from '../types/error-response';

interface NestErrorBody {
  readonly error?: string;
  readonly message?: string | readonly string[];
  readonly statusCode?: number;
}

function isNestErrorBody(value: unknown): value is NestErrorBody {
  return typeof value === 'object' && value !== null;
}

function detailsFromMessage(message: unknown): readonly ErrorDetail[] {
  return Array.isArray(message)
    ? message.map((item) => ({ code: 'VALIDATION_ERROR', field: String(item) }))
    : [];
}

function publicMessage(status: number, body: unknown): string {
  if (status >= 500) {
    return status === 503
      ? 'Service temporarily unavailable.'
      : 'An unexpected error occurred.';
  }

  if (isNestErrorBody(body)) {
    if (typeof body.message === 'string') return body.message;
    if (typeof body.error === 'string') return body.error;
  }
  return 'Request failed.';
}

function errorCode(status: number): string {
  const names: Partial<Record<number, string>> = {
    [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
    [HttpStatus.NOT_FOUND]: 'RESOURCE_NOT_FOUND',
    [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_NOT_READY',
  };
  return names[status] ?? 'INTERNAL_SERVER_ERROR';
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
    const message = isNestErrorBody(body) ? body.message : undefined;

    const payload: ErrorResponse = {
      error: {
        code: errorCode(status),
        message: publicMessage(status, body),
        requestId: request.requestId,
        details: detailsFromMessage(message),
      },
    };

    response.status(status).json(payload);
  }
}
