import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MovieSchedule, ProviderType, Seat, User } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationRepository } from './repository/reservation.repository';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;
  let validationPipe: ValidationPipe;
  const reservation = {
    id: 'id',
    movieScheduleId: 'movieScheduleId',
    personAmt: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'userId',
    movieSchedule: {} as MovieSchedule,
    seats: [] as Seat[],
    user: {} as User,
  };

  const user = {
    id: 'test',
    email: 'test@test.com',
    name: 'tester',
    password: 'hashedPassword',
    createdAt: new Date(),
    role: 1,
    provider: ProviderType.LOCAL,
    isVerified: true,
    phone: '01000000000',
    snsId: null,
    image: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ReservationsController],
      providers: [ReservationsService, ReservationRepository],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('입력값이 올바르다면', async () => {
      const dto: CreateReservationDto = {
        movieScheduleId: 'movieScheduleId',
        seatIds: [],
        personAmt: 1,
      };

      jest.spyOn(service, 'create').mockResolvedValue(reservation);

      const result = await controller.create(new UserEntity(user), dto);
      expect(result.data).toBeInstanceOf(ReservationEntity);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {
        name: 'test',
        reservationId: 'reservationId',
      };

      try {
        await validationPipe.transform(dto, {
          metatype: CreateReservationDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findAll', () => {
    it('모든 예매 정보 정보를 받아와 reservationEntity 배열로 반환', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([reservation]);

      const result = await controller.findAll();
      const reservations = result.data;
      expect(reservations).toBeInstanceOf(Array);
      const allreservationsAreInstanceOfreservationEntity = reservations.every(
        (reservation) => reservation instanceof ReservationEntity,
      );
      expect(allreservationsAreInstanceOfreservationEntity).toBeTruthy();
    });
  });

  describe('findById', () => {
    it('id와 일치하는 예매 정보 정보 반환', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(reservation);
      const result = await controller.findById(reservation.id);
      expect(result.data).toBeInstanceOf(ReservationEntity);
    });
  });

  describe('update', () => {
    it('입력값이 올바르다면', async () => {
      const dto: UpdateReservationDto = {
        personAmt: 2,
      };

      const updatedReservation = {
        ...reservation,
        ...dto,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedReservation);

      const result = await controller.update('test', dto);
      expect(result.data).toBeInstanceOf(ReservationEntity);
      expect(result.data).toMatchObject(updatedReservation);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {};

      try {
        await validationPipe.transform(dto, {
          metatype: UpdateReservationDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deleteById', () => {
    it('id가 올바르다면 예매 정보 삭제', async () => {
      jest.spyOn(service, 'deleteById').mockResolvedValue(reservation);
      const result = await controller.deleteById(reservation.id);
      expect(result.status).toEqual(201);
    });
  });
});
