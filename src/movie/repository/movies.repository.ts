import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Injectable()
export class MoviesRepository {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    return await this.prisma.movie.create({ data: createMovieDto });
  }

  async findByOrderFilter(orderBy?: { [x: string]: 'desc' | 'asc' }) {
    return await this.prisma.movie.findMany({
      orderBy,
    });
  }

  async findFirst(params: Prisma.MovieFindFirstArgs) {
    return await this.prisma.movie.findFirst(params);
  }

  async findById(id: string) {
    return await this.prisma.movie.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    return await this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  async deleteById(id: string) {
    return await this.prisma.movie.delete({
      where: { id },
    });
  }

  async deleteMany(startDateStr: string) {
    return await this.prisma.movie.deleteMany({
      where: {
        release_date: {
          lt: startDateStr,
        },
      },
    });
  }

  async upsert(movieDto: CreateMovieDto) {
    return await this.prisma.movie.upsert({
      where: {
        id: movieDto.id,
      },
      update: movieDto,
      create: movieDto,
    });
  }
}
