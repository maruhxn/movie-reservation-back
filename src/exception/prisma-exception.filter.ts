//src/prisma-client-exception.filter.ts

import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    super();
  }
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        res.status(status).json({
          statusCode: status,
          message: message,
          error: exception.meta.cause,
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        return res.status(status).json({
          statusCode: status,
          message: exception.message,
          error: exception.meta.cause,
        });
      }
      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
  }
}
