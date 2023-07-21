import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BatchService } from 'src/batch/batch.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let batchService: BatchService;
  const MovieShape = expect.objectContaining({
    id: expect.any(String),
    adult: expect.any(Boolean),
    genres: expect.any(Array<string>),
    original_language: expect.any(String),
    original_title: expect.any(String),
    overview: expect.any(String),
    popularity: expect.any(Number),
    release_date: expect.any(String),
    runtime: expect.any(Number),
    title: expect.any(String),
    vote_average: expect.any(Number),
    vote_count: expect.any(Number),
    backdrop_path: expect.any(String),
    poster_path: expect.any(String),
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.enableCors({ origin: 'http://localhost:3000', credentials: true });
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    prisma = app.get<PrismaService>(PrismaService);
    batchService = app.get<BatchService>(BatchService);
    await prisma.enableShutdownHooks(app);

    await batchService.getMovies();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/movies', () => {
    it('GET', async () => {
      const { body } = await request(app.getHttpServer()).get('/movies');
      const movies = body.data;
      expect(movies).toStrictEqual(expect.arrayContaining([MovieShape]));
    });
  });
});
