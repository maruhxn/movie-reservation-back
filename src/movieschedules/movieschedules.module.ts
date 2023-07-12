import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MovieschedulesController } from './movieschedules.controller';
import { MovieschedulesService } from './movieschedules.service';
import { MoviescheduleRepository } from './repository/movieschedules.repository';

@Module({
  imports: [PrismaModule],
  controllers: [MovieschedulesController],
  providers: [MovieschedulesService, MoviescheduleRepository],
})
export class MovieschedulesModule {}
