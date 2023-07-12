import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeatsModule } from 'src/seats/seats.module';
import { ScreenRepository } from './repository/screen.repository';
import { ScreenService } from './screen.service';

describe('ScreenService', () => {
  let service: ScreenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, SeatsModule],
      providers: [ScreenService, ScreenRepository],
    }).compile();

    service = module.get<ScreenService>(ScreenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
