import { Injectable } from '@nestjs/common';
import { MovieSchedule } from '@prisma/client';
import { CreateMoviescheduleDto } from './dto/create-movieschedule.dto';
import { UpdateMoviescheduleDto } from './dto/update-movieschedule.dto';
import { MoviescheduleRepository } from './repository/movieschedules.repository';

@Injectable()
export class MovieschedulesService {
  constructor(private moviescheduleRepository: MoviescheduleRepository) {}

  async create(createMoviescheduleDto: CreateMoviescheduleDto) {
    const movieSchedule = await this.moviescheduleRepository.create(
      createMoviescheduleDto,
    );
    return movieSchedule;
  }

  async findAllByDate(startDate: string) {
    const movieSchedules: MovieSchedule[] =
      await this.moviescheduleRepository.findAllByDate(startDate);

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
