import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BatchModule } from './batch/batch.module';
import authConfig from './config/auth.config';
import emailConfig from './config/email.config';
import movieConfig from './config/movie.config';
import { DBInitializerService } from './dbInitializer.service';
import { ExceptionModule } from './exception/exception.module';
import { ConfigValidationSchhma } from './lib/schemas/config.schema';
import { LoggerModule } from './logger/logger.module';
import { MoviesModule } from './movie/movies.module';
import { MovieschedulesModule } from './movieschedules/movieschedules.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ScreenModule } from './screen/screen.module';
import { SeatsModule } from './seats/seats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
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
    ScreenModule,
    SeatsModule,
    MovieschedulesModule,
    ReservationsModule,
  ],
  controllers: [],
  providers: [DBInitializerService],
})
export class AppModule {}
