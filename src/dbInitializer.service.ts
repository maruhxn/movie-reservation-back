import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BatchService } from './batch/batch.service';

@Injectable()
export class DBInitializerService implements OnApplicationBootstrap {
  constructor(private readonly batchService: BatchService) {}

  onApplicationBootstrap() {
    process.env.NODE_ENV !== 'test' && this.batchService.getMovies();
  }
}
