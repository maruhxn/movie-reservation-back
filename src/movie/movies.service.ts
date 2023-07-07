import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movies.entity';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private prisma: PrismaService,
  ) {}

  async refreshEveryday(
    createMovieDto: CreateMovieDto[],
    startDateStr: string,
  ) {
    // release-date가 startDate보다 작은 경우, movie 삭제
    const deleted = await this.prisma.movie.deleteMany({
      where: {
        release_date: {
          lt: startDateStr,
        },
      },
    });
    this.logger.log('Out Dated', deleted.count);

    // 이미 movieId에 해당하는 movie가 존재한다면 create X, 없다면 create

    createMovieDto.map(async (movieDto) => {
      await this.prisma.movie.upsert({
        where: {
          id: movieDto.id,
        },
        update: movieDto,
        create: movieDto,
      });
    });

    return this.logger.log('영화 정보 업데이트 성공', new Date().toISOString());
  }

  async create(createMovieDto: CreateMovieDto) {
    const movie = await this.prisma.movie.create({
      data: createMovieDto,
    });

    return new MovieEntity(movie);
  }

  async findAll(filterDto?: FilterDto) {
    // 인기도, 개봉일, 평점, 제목 순으로 정렬.
    const { condition, sort } = filterDto;
    const orderBy = {
      [condition]: sort,
    };
    const movies = await this.prisma.movie.findMany({
      orderBy,
    });

    return movies.map((movie) => new MovieEntity(movie));
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id,
      },
    });

    return new MovieEntity(movie);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });

    return new MovieEntity(movie);
  }

  async remove(id: string) {
    const movie = await this.prisma.movie.delete({
      where: { id },
    });

    return new MovieEntity(movie);
  }
}
