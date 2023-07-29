import { Module } from '@nestjs/common';
import { MoviesModule } from 'src/movie/movies.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MovieschedulesController } from './movieschedules.controller';
import { MovieschedulesService } from './movieschedules.service';
import { MoviescheduleRepository } from './repository/movieschedules.repository';

@Module({
  imports: [PrismaModule, MoviesModule],
  controllers: [MovieschedulesController],
  providers: [MovieschedulesService, MoviescheduleRepository],
})
export class MovieschedulesModule {}
