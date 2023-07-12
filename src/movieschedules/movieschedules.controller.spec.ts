import { Test, TestingModule } from '@nestjs/testing';
import { MovieschedulesController } from './movieschedules.controller';
import { MovieschedulesService } from './movieschedules.service';

describe('MovieschedulesController', () => {
  let controller: MovieschedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieschedulesController],
      providers: [MovieschedulesService],
    }).compile();

    controller = module.get<MovieschedulesController>(MovieschedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
