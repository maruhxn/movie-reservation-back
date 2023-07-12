import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeatsModule } from 'src/seats/seats.module';
import { ScreenRepository } from './repository/screen.repository';
import { ScreenController } from './screen.controller';
import { ScreenService } from './screen.service';

describe('ScreenController', () => {
  let controller: ScreenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, SeatsModule],
      controllers: [ScreenController],
      providers: [ScreenService, ScreenRepository],
    }).compile();

    controller = module.get<ScreenController>(ScreenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
