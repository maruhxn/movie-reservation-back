import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Movie, Reservation, Screen } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateMoviescheduleDto } from './dto/create-movieschedule.dto';
import { UpdateMoviescheduleDto } from './dto/update-movieschedule.dto';
import { MoviescheduleEntity } from './entities/movieschedule.entity';
import { MovieschedulesController } from './movieschedules.controller';
import { MovieschedulesService } from './movieschedules.service';
import { MoviescheduleRepository } from './repository/movieschedules.repository';

describe('MovieschedulesController', () => {
  let controller: MovieschedulesController;
  let service: MovieschedulesService;
  let validationPipe: ValidationPipe;
  const movieSchedule = {
    id: 'movieScheduleId',
    movieId: 'movieId',
    screenId: 'screenId',
    startTm: new Date(),
    endTm: new Date(),
    movie: {} as Movie,
    screen: {} as Screen,
    reservations: [] as Reservation[],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [MovieschedulesController],
      providers: [MovieschedulesService, MoviescheduleRepository],
    }).compile();

    controller = module.get<MovieschedulesController>(MovieschedulesController);
    service = module.get<MovieschedulesService>(MovieschedulesService);
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('입력값이 올바르다면', async () => {
      const dto: CreateMoviescheduleDto = {
        movieId: 'movieId',
        screenId: 'screenId',
        startTm: new Date(),
        endTm: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(movieSchedule);

      const result = await controller.create(dto);
      expect(result.data).toBeInstanceOf(MoviescheduleEntity);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {};

      try {
        await validationPipe.transform(dto, {
          metatype: CreateMoviescheduleDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findAll', () => {
    const startTm = '';
    it('모든 영화 스케쥴 정보 정보를 받아와 movieScheduleEntity 배열로 반환', async () => {
      jest.spyOn(service, 'findAllByDate').mockResolvedValue([movieSchedule]);

      const result = await controller.findAll(startTm);
      const movieSchedules = result.data;
      expect(movieSchedules).toBeInstanceOf(Array);
      const allmovieSchedulesAreInstanceOfmovieScheduleEntity =
        movieSchedules.every(
          (movieSchedule) => movieSchedule instanceof MoviescheduleEntity,
        );
      expect(allmovieSchedulesAreInstanceOfmovieScheduleEntity).toBeTruthy();
    });
  });

  describe('findById', () => {
    it('id와 일치하는 영화 스케쥴 정보 정보 반환', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(movieSchedule);
      const result = await controller.findById(movieSchedule.id);
      expect(result.data).toBeInstanceOf(MoviescheduleEntity);
    });
  });

  describe('update', () => {
    it('입력값이 올바르다면', async () => {
      const dto: UpdateMoviescheduleDto = {
        startTm: new Date(),
      };

      const updatedmovieSchedule = {
        ...movieSchedule,
        ...dto,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedmovieSchedule);

      const result = await controller.update('test', dto);
      expect(result.data).toBeInstanceOf(MoviescheduleEntity);
      expect(result.data).toMatchObject(updatedmovieSchedule);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {};

      try {
        await validationPipe.transform(dto, {
          metatype: UpdateMoviescheduleDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deleteById', () => {
    it('id가 올바르다면 영화 스케쥴 정보 삭제', async () => {
      jest.spyOn(service, 'deleteById').mockResolvedValue(movieSchedule);
      const result = await controller.deleteById(movieSchedule.id);
      expect(result.status).toEqual(201);
    });
  });
});
