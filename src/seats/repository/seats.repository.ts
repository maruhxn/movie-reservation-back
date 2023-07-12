import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSeatDto } from '../dto/create-seat.dto';
import { UpdateSeatDto } from '../dto/update-seat.dto';

@Injectable()
export class SeatsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createSeatDto: CreateSeatDto) {
    return await this.prisma.seat.create({ data: createSeatDto });
  }

  async createMany(createSeatDtos: CreateSeatDto[]) {
    return await this.prisma.seat.createMany({ data: createSeatDtos });
  }

  async findManyWithNames(difference: number) {
    const seatIds = await this.prisma.seat.findMany({
      orderBy: {
        name: 'desc',
      },
      select: {
        id: true,
      },
      take: Math.abs(difference),
    });
    return seatIds;
  }

  async findAll(params?: Prisma.SeatFindManyArgs) {
    return await this.prisma.seat.findMany(params);
  }

  async findById(id: string) {
    return await this.prisma.seat.findUnique({ where: { id } });
  }

  async update(id: string, updateSeatDto: UpdateSeatDto) {
    return await this.prisma.seat.update({
      where: { id },
      data: updateSeatDto,
    });
  }

  async deleteById(id: string) {
    return await this.prisma.seat.delete({
      where: { id },
    });
  }

  async deleteManyById(ids: string[]) {
    return await this.prisma.seat.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
