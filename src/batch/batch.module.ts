import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MoviesModule } from 'src/movie/movies.module';
import { BatchService } from './batch.service';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot(), MoviesModule],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
