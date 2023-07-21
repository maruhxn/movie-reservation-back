import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeatsRepository } from './repository/seats.repository';
import { SeatsService } from './seats.service';

describe('SeatsService', () => {
  let seatsService: SeatsService;
  let seatsRepository: SeatsRepository;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SeatsService, SeatsRepository],
    }).compile();

    seatsService = module.get<SeatsService>(SeatsService);
    seatsRepository = module.get<SeatsRepository>(SeatsRepository);
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
  });

  it('should be defined', () => {
    expect(seatsService).toBeDefined();
  });

  // describe('Create Seats', () => {
  //   const seat = {} as Seat;
  //   it('올바른 입력이 들어오면, 좌석 생성', async () => {
  //     jest
  //       .spyOn(seatsRepository, 'create')
  //       .mockResolvedValue(Promise.resolve(seat));
  //     const createSeatDto = {
  //       name: 'A1',
  //       screenId: 'testid',
  //     };
  //     const result = await seatsService.create(createSeatDto);

  //     expect(result).toBeInstanceOf(SeatEntity);
  //   });

  //   // it('올바르지 않은 입력이 들어오면, 에러 HTTP Error 발생');
  // });
});
