import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSeatDto } from '../dto/create-seat.dto';
import { UpdateSeatDto } from '../dto/update-seat.dto';

@Injectable()
export class SeatsRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: CreateSeatDto }) {
    const { data } = params;
    return await this.prisma.seat.create({
      data,
    });
  }

  async createMany(params: { data: CreateSeatDto[] }) {
    const { data } = params;
    return await this.prisma.seat.createMany({
      data,
    });
  }

  async findMany(params?: Prisma.SeatFindManyArgs) {
    return await this.prisma.seat.findMany(params);
  }

  async findFirst(params: Prisma.SeatFindFirstArgs) {
    return await this.prisma.seat.findFirst(params);
  }

  async findUnique(params: Prisma.SeatFindUniqueArgs) {
    return await this.prisma.seat.findUnique(params);
  }

  async update(params: {
    where: Prisma.SeatWhereUniqueInput;
    data: UpdateSeatDto;
  }) {
    const { where, data } = params;
    return await this.prisma.seat.update({ where, data });
  }

  async delete(params: Prisma.SeatDeleteArgs) {
    return await this.prisma.seat.delete(params);
  }
}
