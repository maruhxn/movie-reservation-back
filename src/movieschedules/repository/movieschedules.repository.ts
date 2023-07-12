import { Injectable } from '@nestjs/common';
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
        screen: true,
      },
    });
  }

  async findAllByDate(startDate: string) {
    return await this.prisma.movieSchedule.findMany({
      where: {
        startDate,
      },
      include: {
        movie: true,
        screen: true,
        reservations: true,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.movieSchedule.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: true,
        reservations: true,
      },
    });
  }

  async update(id: string, updateMoviescheduleDto: UpdateMoviescheduleDto) {
    return await this.prisma.movieSchedule.update({
      where: { id },
      data: updateMoviescheduleDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.movieSchedule.delete({
      where: { id },
    });
  }
}
