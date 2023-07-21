import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Seat } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { SeatEntity } from './entities/seat.entity';
import { SeatsRepository } from './repository/seats.repository';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';

describe('SeatsController', () => {
  let seatsController: SeatsController;
  let seatsService: SeatsService;
  let validationPipe: ValidationPipe;
  const seat: Seat = {
    id: 'test',
    name: 'A1',
    screenId: 'screenId',
    reservationId: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [SeatsController],
      providers: [SeatsService, SeatsRepository],
    }).compile();

    seatsController = module.get<SeatsController>(SeatsController);
    seatsService = module.get<SeatsService>(SeatsService);
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
  });

  it('should be defined', () => {
    expect(seatsController).toBeDefined();
  });

  describe('create', () => {
    it('입력값이 올바르다면', async () => {
      const dto: CreateSeatDto = {
        name: 'A1',
        screenId: 'screenId',
      };

      jest.spyOn(seatsService, 'create').mockResolvedValue(seat);

      const result = await seatsController.create(dto);
      expect(result.data).toBeInstanceOf(SeatEntity);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {
        name: 'test',
        screenId: 'screenId',
      };

      try {
        await validationPipe.transform(dto, {
          metatype: CreateSeatDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findAll', () => {
    it('모든 좌석 정보를 받아와 SeatEntity 배열로 반환', async () => {
      jest.spyOn(seatsService, 'findAll').mockResolvedValue([seat]);

      const result = await seatsController.findAll();
      const seats = result.data;
      expect(seats).toBeInstanceOf(Array);
      const allSeatsAreInstanceOfSeatEntity = seats.every(
        (seat) => seat instanceof SeatEntity,
      );
      expect(allSeatsAreInstanceOfSeatEntity).toBeTruthy();
    });
  });

  describe('findById', () => {
    it('id와 일치하는 좌석 정보 반환', async () => {
      jest.spyOn(seatsService, 'findById').mockResolvedValue(seat);
      const result = await seatsController.findById(seat.id);
      expect(result.data).toBeInstanceOf(SeatEntity);
    });
  });

  describe('update', () => {
    it('입력값이 올바르다면', async () => {
      const dto: UpdateSeatDto = {
        name: 'A2',
      };

      const updatedSeat = {
        ...seat,
        ...dto,
      };

      jest.spyOn(seatsService, 'update').mockResolvedValue(updatedSeat);

      const result = await seatsController.update('test', dto);
      expect(result.data).toBeInstanceOf(SeatEntity);
      expect(result.data).toMatchObject(updatedSeat);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {};

      try {
        await validationPipe.transform(dto, {
          metatype: UpdateSeatDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deleteById', () => {
    it('id가 올바르다면 좌석 삭제', async () => {
      jest.spyOn(seatsService, 'deleteById').mockResolvedValue(seat);
      const result = await seatsController.deleteById(seat.id);
      expect(result.status).toEqual(201);
    });
  });
});
