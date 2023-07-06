import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MovieModule } from 'src/movie/movie.module';
import { BatchService } from './batch.service';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot(), MovieModule],
  providers: [BatchService],
})
export class BatchModule {}
