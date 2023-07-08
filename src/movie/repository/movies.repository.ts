import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Injectable()
export class MoviesRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: CreateMovieDto }) {
    const { data } = params;
    return await this.prisma.movie.create({ data });
  }

  async findMany(params?: Prisma.MovieFindManyArgs) {
    return await this.prisma.movie.findMany(params);
  }

  async findFirst(params: Prisma.MovieFindFirstArgs) {
    return await this.prisma.movie.findFirst(params);
  }

  async findUnique(params: Prisma.MovieFindUniqueArgs) {
    return await this.prisma.movie.findUnique(params);
  }

  async update(params: {
    where: Prisma.MovieWhereUniqueInput;
    data: UpdateMovieDto;
  }) {
    const { where, data } = params;
    return await this.prisma.movie.update({ where, data });
  }

  async delete(params: Prisma.MovieDeleteArgs) {
    return await this.prisma.movie.delete(params);
  }

  async deleteMany(params: Prisma.MovieDeleteManyArgs) {
    return await this.prisma.movie.deleteMany(params);
  }

  async upsert(params: {
    where: Prisma.MovieWhereUniqueInput;
    update: UpdateMovieDto;
    create: CreateMovieDto;
  }) {
    const { where, update, create } = params;
    return await this.prisma.movie.upsert({ where, update, create });
  }
}
