import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorDetailResponseDto {
  @ApiPropertyOptional({ example: 'email' })
  readonly field?: string;

  @ApiProperty({ example: 'isEmail' })
  readonly code!: string;
}

export class ErrorBodyResponseDto {
  @ApiProperty({ example: 'VALIDATION_FAILED' })
  readonly code!: string;

  @ApiProperty({ example: 'Request validation failed.' })
  readonly message!: string;

  @ApiProperty({ example: 'req_7d22a492-242b-4920-8974-d1d812fd960a' })
  readonly requestId!: string;

  @ApiProperty({ type: [ErrorDetailResponseDto] })
  readonly details!: readonly ErrorDetailResponseDto[];
}

export class ErrorResponseDto {
  @ApiProperty({ type: ErrorBodyResponseDto })
  readonly error!: ErrorBodyResponseDto;
}
