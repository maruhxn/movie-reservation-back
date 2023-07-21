import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movies.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './repository/movies.repository';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;
  let validationPipe: ValidationPipe;
  const movie = {
    id: 'movieId',
    adult: false,
    genres: [] as string[],
    original_language: 'kr',
    original_title: 'test',
    overview: 'test',
    popularity: 1.1,
    release_date: '2023-07-21',
    runtime: 150,
    title: 'test',
    vote_average: 1.1,
    vote_count: 0,
    backdrop_path: 'test',
    poster_path: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, PrismaModule],
      controllers: [MoviesController],
      providers: [MoviesService, MoviesRepository],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('입력값이 올바르다면', async () => {
      const dto: CreateMovieDto = {
        id: 'movieId',
        adult: false,
        genres: [] as string[],
        original_language: 'kr',
        original_title: 'test',
        overview: 'test',
        popularity: 1.1,
        release_date: '2023-07-21',
        runtime: 150,
        title: 'test',
        vote_average: 1.1,
        vote_count: 0,
        backdrop_path: 'test',
        poster_path: 'test',
      };

      jest.spyOn(service, 'create').mockResolvedValue(movie);

      const result = await controller.create(dto);
      expect(result.data).toBeInstanceOf(MovieEntity);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {};

      try {
        await validationPipe.transform(dto, {
          metatype: CreateMovieDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findAll', () => {
    it('모든 영화 정보 정보를 받아와 movieEntity 배열로 반환', async () => {
      const dto: FilterDto = {
        sort: 'asc',
        condition: 'title',
      };
      jest.spyOn(service, 'findByOrderFilter').mockResolvedValue([movie]);

      const result = await controller.findByOrderFilter(dto);
      const movies = result.data;
      expect(movies).toBeInstanceOf(Array);
      const allmoviesAreInstanceOfmovieEntity = movies.every(
        (movie) => movie instanceof MovieEntity,
      );
      expect(allmoviesAreInstanceOfmovieEntity).toBeTruthy();
    });
    it('쿼리 필터가 올바르지 않다면, validation error 발생', async () => {
      const dto = {
        error: 'error',
      };

      try {
        await validationPipe.transform(dto, {
          metatype: FilterDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findById', () => {
    it('id와 일치하는 영화 정보 정보 반환', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(movie);
      const result = await controller.findById(movie.id);
      expect(result.data).toBeInstanceOf(MovieEntity);
    });
  });

  describe('update', () => {
    it('입력값이 올바르다면', async () => {
      const dto: UpdateMovieDto = {
        title: 'test2',
      };

      const updatedmovie = {
        ...movie,
        ...dto,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedmovie);

      const result = await controller.update('test', dto);
      expect(result.data).toBeInstanceOf(MovieEntity);
      expect(result.data).toMatchObject(updatedmovie);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {};

      try {
        await validationPipe.transform(dto, {
          metatype: UpdateMovieDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deleteById', () => {
    it('id가 올바르다면 영화 정보 삭제', async () => {
      jest.spyOn(service, 'deleteById').mockResolvedValue(movie);
      const result = await controller.deleteById(movie.id);
      expect(result.status).toEqual(201);
    });
  });
});
