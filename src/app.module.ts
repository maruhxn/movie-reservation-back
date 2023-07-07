import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BatchModule } from './batch/batch.module';
import authConfig from './config/auth.config';
import emailConfig from './config/email.config';
import movieConfig from './config/movie.config';
import { ExceptionModule } from './exception/exception.module';
import { ConfigValidationSchhma } from './lib/schemas/config.schema';
import { LoggerModule } from './logger/logger.module';
import { MoviesModule } from './movie/movies.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/.env.${process.env.NODE_ENV}`],
      load: [emailConfig, authConfig, movieConfig],
      isGlobal: true,
      validationSchema: ConfigValidationSchhma,
    }),
    AuthModule,
    ExceptionModule,
    LoggerModule,
    BatchModule,
    MoviesModule,
    PrismaModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
