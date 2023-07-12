import { Test, TestingModule } from '@nestjs/testing';
import { MovieschedulesService } from './movieschedules.service';

describe('MovieschedulesService', () => {
  let service: MovieschedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieschedulesService],
    }).compile();

    service = module.get<MovieschedulesService>(MovieschedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
