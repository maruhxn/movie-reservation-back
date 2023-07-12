import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './repository/movies.repository';

@Injectable()
export class MoviesService {
  constructor(private moviesRepository: MoviesRepository) {}

  async refreshEveryday(
    createMovieDtos: CreateMovieDto[],
    startDateStr: string,
  ) {
    // release-date가 startDate보다 작은 경우, movie 삭제
    const deleted = await this.moviesRepository.deleteMany(startDateStr);

    // 이미 movieId에 해당하는 movie가 존재한다면 create X, 없다면 create

    createMovieDtos.map(async (movieDto) => {
      await this.moviesRepository.upsert(movieDto);
    });
    return deleted.count;
  }

  async create(createMovieDto: CreateMovieDto) {
    const movie = await this.moviesRepository.create(createMovieDto);
    return movie;
  }

  async findByOrderFilter(filterDto?: FilterDto) {
    // 인기도, 개봉일, 평점, 제목 순으로 정렬.
    const { condition, sort } = filterDto;
    const orderBy = {
      [condition]: sort,
    };
    const movies = await this.moviesRepository.findByOrderFilter(orderBy);

    return movies;
  }

  async findById(id: string) {
    const movie = await this.moviesRepository.findById(id);

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.moviesRepository.update(id, updateMovieDto);
    if (!movie) throw new NotFoundException('영화 정보가 없습니다.');

    return movie;
  }

  async deleteById(id: string) {
    const movie = await this.moviesRepository.deleteById(id);

    if (!movie) throw new NotFoundException('영화 정보가 없습니다.');

    return movie;
  }
}
