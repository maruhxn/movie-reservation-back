import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMoviescheduleDto } from '../dto/create-movieschedule.dto';
import { UpdateMoviescheduleDto } from './../dto/update-movieschedule.dto';

@Injectable()
export class MoviescheduleRepository {
  constructor(private prisma: PrismaService) {}

  async create(createMoviescheduleDto: CreateMoviescheduleDto) {
    return await this.prisma.movieSchedule.create({
      data: createMoviescheduleDto,
      include: {
        movie: true,
        screen: {
          include: {
            seats: true,
          },
        },
        reservations: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.movieSchedule.findMany({
      include: {
        movie: true,
        screen: {
          include: {
            seats: true,
          },
        },
        reservations: true,
      },
    });
  }

  async findAllByDate(startTm: string, movieId?: string) {
    const movieSchedules = await this.prisma.movieSchedule.findMany({
      where: movieId && { movieId },
      include: {
        movie: true,
        screen: {
          include: {
            seats: true,
          },
        },
        reservations: true,
      },
      orderBy: [{ startTm: 'asc' }],
    });

    const validMovieSchedules = movieSchedules.filter(
      (ms) =>
        format(new Date(startTm), 'yyyy-MM-dd') ===
        format(ms.startTm, 'yyyy-MM-dd'),
    );
    return validMovieSchedules;
  }

  async findById(id: string) {
    const ms = await this.prisma.movieSchedule.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: true,
        reservations: true,
      },
    });
    console.log(ms);
    return ms;
  }

  async update(id: string, updateMoviescheduleDto: UpdateMoviescheduleDto) {
    return await this.prisma.movieSchedule.update({
      where: { id },
      data: updateMoviescheduleDto,
      include: {
        movie: true,
        screen: true,
        reservations: true,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.movieSchedule.delete({
      where: { id },
      include: {
        movie: true,
        screen: true,
        reservations: true,
      },
    });
  }
}
