import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScreenDto } from '../dto/create-screen.dto';
import { UpdateScreenDto } from '../dto/update-screen.dto';

@Injectable()
export class ScreenRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: CreateScreenDto }) {
    const { data } = params;
    return await this.prisma.screen.create({
      data,
    });
  }

  async findMany(params?: Prisma.ScreenFindManyArgs) {
    return await this.prisma.screen.findMany(params);
  }

  async findFirst(params: Prisma.ScreenFindFirstArgs) {
    return await this.prisma.screen.findFirst(params);
  }

  async findUnique(params: Prisma.ScreenFindUniqueArgs) {
    return await this.prisma.screen.findUnique(params);
  }

  async update(params: {
    where: Prisma.ScreenWhereUniqueInput;
    data: UpdateScreenDto;
  }) {
    const { where, data } = params;
    return await this.prisma.screen.update({ where, data });
  }

  async delete(params: Prisma.ScreenDeleteArgs) {
    return await this.prisma.screen.delete(params);
  }
}
