import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movies.entity';
import { MoviesRepository } from './repository/movies.repository';

@Injectable()
export class MoviesService {
  constructor(private moviesRepository: MoviesRepository) {}

  async refreshEveryday(
    createMovieDtos: CreateMovieDto[],
    startDateStr: string,
  ) {
    // release-date가 startDate보다 작은 경우, movie 삭제
    const deleted = await this.moviesRepository.deleteMany({
      where: {
        release_date: {
          lt: startDateStr,
        },
      },
    });

    // 이미 movieId에 해당하는 movie가 존재한다면 create X, 없다면 create

    createMovieDtos.map(async (movieDto) => {
      await this.moviesRepository.upsert({
        where: {
          id: movieDto.id,
        },
        update: movieDto,
        create: movieDto,
      });
    });

    return deleted.count;
  }

  async create(createMovieDto: CreateMovieDto) {
    const movie = await this.moviesRepository.create({ data: createMovieDto });

    return new MovieEntity(movie);
  }

  async findAll(filterDto?: FilterDto) {
    // 인기도, 개봉일, 평점, 제목 순으로 정렬.
    const { condition, sort } = filterDto;
    const orderBy = {
      [condition]: sort,
    };
    const movies = await this.moviesRepository.findMany({
      orderBy,
    });

    return movies.map((movie) => new MovieEntity(movie));
  }

  async findOne(id: string) {
    const movie = await this.moviesRepository.findUnique({
      where: {
        id,
      },
    });

    return new MovieEntity(movie);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.moviesRepository.update({
      where: { id },
      data: updateMovieDto,
    });

    return new MovieEntity(movie);
  }

  async remove(id: string) {
    const movie = await this.moviesRepository.delete({
      where: { id },
    });

    return new MovieEntity(movie);
  }
}
