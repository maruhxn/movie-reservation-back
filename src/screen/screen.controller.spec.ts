import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MovieSchedule, Screen, Seat } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeatsModule } from 'src/seats/seats.module';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ScreenEntity } from './entities/screen.entity';
import { ScreenRepository } from './repository/screen.repository';
import { ScreenController } from './screen.controller';
import { ScreenService } from './screen.service';

describe('ScreenController', () => {
  let controller: ScreenController;
  let service: ScreenService;
  let validationPipe: ValidationPipe;
  const screen: Screen = {
    id: 'screenId',
    screenNum: 1,
    seatAmt: 10,
  };

  const screenIncludeMSAndSeats = {
    id: 'screenId',
    screenNum: 1,
    seatAmt: 10,
    movieSchedules: [] as MovieSchedule[],
    seats: [] as Seat[],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, SeatsModule],
      controllers: [ScreenController],
      providers: [ScreenService, ScreenRepository],
    }).compile();

    controller = module.get<ScreenController>(ScreenController);
    service = module.get<ScreenService>(ScreenService);
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('입력값이 올바르다면', async () => {
      const dto: CreateScreenDto = {
        screenNum: 1,
        seatAmt: 10,
      };

      jest.spyOn(service, 'create').mockResolvedValue(screen);

      const result = await controller.create(dto);
      expect(result.data).toBeInstanceOf(ScreenEntity);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {
        name: 'test',
        screenId: 'screenId',
      };

      try {
        await validationPipe.transform(dto, {
          metatype: CreateScreenDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findAll', () => {
    it('모든 상영관 정보를 받아와 screenEntity 배열로 반환', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([screen]);

      const result = await controller.findAll();
      const screens = result.data;
      expect(screens).toBeInstanceOf(Array);
      const allscreensAreInstanceOfscreenEntity = screens.every(
        (screen) => screen instanceof ScreenEntity,
      );
      expect(allscreensAreInstanceOfscreenEntity).toBeTruthy();
    });
  });

  describe('findById', () => {
    it('id와 일치하는 상영관 정보 반환', async () => {
      jest
        .spyOn(service, 'findById')
        .mockResolvedValue(screenIncludeMSAndSeats);
      const result = await controller.findById(screen.id);
      expect(result.data).toBeInstanceOf(ScreenEntity);
      expect(result.data).toEqual(
        expect.objectContaining({
          movieSchedules: [],
          seats: [],
        }),
      );
    });
  });

  describe('update', () => {
    it('입력값이 올바르다면', async () => {
      const dto: UpdateScreenDto = {
        screenNum: 2,
      };

      const updatedscreen = {
        ...screen,
        ...dto,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedscreen);

      const result = await controller.update('test', dto);
      expect(result.data).toBeInstanceOf(ScreenEntity);
      expect(result.data).toMatchObject(updatedscreen);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {};

      try {
        await validationPipe.transform(dto, {
          metatype: UpdateScreenDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deleteById', () => {
    it('id가 올바르다면 상영관 삭제', async () => {
      jest.spyOn(service, 'deleteById').mockResolvedValue(screen);
      const result = await controller.deleteById(screen.id);
      expect(result.status).toEqual(201);
    });
  });
});
