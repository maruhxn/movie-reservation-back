import { BadRequestException, Injectable } from '@nestjs/common';
import { MovieSchedule } from '@prisma/client';
import { MoviesService } from './../movie/movies.service';
import { CreateMoviescheduleDto } from './dto/create-movieschedule.dto';
import { UpdateMoviescheduleDto } from './dto/update-movieschedule.dto';
import { MoviescheduleRepository } from './repository/movieschedules.repository';

@Injectable()
export class MovieschedulesService {
  constructor(
    private moviescheduleRepository: MoviescheduleRepository,
    private moviesService: MoviesService,
  ) {}

  private isEndTimeValid(startTm: Date, endTm: Date, runtime: number) {
    // Convert movie.runtime to milliseconds
    const runtimeInMilliseconds = runtime * 60000; // 1 minute = 60,000 milliseconds

    // Calculate the expected end time
    const expectedEndTm = new Date(startTm.getTime() + runtimeInMilliseconds);

    // Compare with the actual end time
    return endTm < expectedEndTm ? false : true;
  }

  async create(createMoviescheduleDto: CreateMoviescheduleDto) {
    const movie = await this.moviesService.findById(
      createMoviescheduleDto.movieId,
    );

    if (
      !this.isEndTimeValid(
        createMoviescheduleDto.startTm,
        createMoviescheduleDto.endTm,
        movie.runtime,
      )
    ) {
      throw new BadRequestException('영화 종료 시간이 올바르지 않습니다.');
    }
    const movieSchedule = await this.moviescheduleRepository.create(
      createMoviescheduleDto,
    );
    return movieSchedule;
  }

  async findAll() {
    const movieSchedules: MovieSchedule[] =
      await this.moviescheduleRepository.findAll();

    return movieSchedules;
  }

  async findAllByDate(startTm: string, movieId?: string) {
    const movieSchedules = await this.moviescheduleRepository.findAllByDate(
      startTm,
      movieId,
    );

    return movieSchedules;
  }

  async findById(id: string) {
    const movieSchedule = await this.moviescheduleRepository.findById(id);
    return movieSchedule;
  }

  async update(id: string, updateMoviescheduleDto: UpdateMoviescheduleDto) {
    return await this.moviescheduleRepository.update(
      id,
      updateMoviescheduleDto,
    );
  }

  async deleteById(id: string) {
    return await this.moviescheduleRepository.delete(id);
  }
}
