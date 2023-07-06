import { Global, Module } from '@nestjs/common';
import * as appRoot from 'app-root-path';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

export const logDir = `${appRoot}/logs`;

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(), // 로그 시각 표시
            nestWinstonModuleUtilities.format.nestLike(
              'MovieReservationServer',
              {
                // 앱 이름과 가독성.
                prettyPrint: true,
              },
            ),
          ),
        }),
        new winstonDaily({
          level: 'info',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          dirname: logDir,
          maxFiles: 30,
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(
              (info) =>
                `[${info.timestamp}] [MovieReservationServer].${info.level}: ${info.message}`,
            ),
          ),
        }),
        new winstonDaily({
          level: 'error',
          filename: '%DATE%.error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          dirname: logDir,
          maxFiles: 30,
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(
              (info) =>
                `[${info.timestamp}] [MovieReservationServer].${info.level}: ${info.message}`,
            ),
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
