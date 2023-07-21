import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MovieschedulesService } from './movieschedules.service';
import { MoviescheduleRepository } from './repository/movieschedules.repository';

describe('MovieschedulesService', () => {
  let service: MovieschedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [MovieschedulesService, MoviescheduleRepository],
    }).compile();

    service = module.get<MovieschedulesService>(MovieschedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
