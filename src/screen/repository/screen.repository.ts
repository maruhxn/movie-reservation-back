import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScreenDto } from '../dto/create-screen.dto';
import { UpdateScreenDto } from '../dto/update-screen.dto';

@Injectable()
export class ScreenRepository {
  constructor(private prisma: PrismaService) {}

  async create(createScreenDto: CreateScreenDto) {
    return await this.prisma.screen.create({
      data: createScreenDto,
    });
  }

  async findAll(params?: Prisma.ScreenFindManyArgs) {
    return await this.prisma.screen.findMany(params);
  }

  async findById(id: string) {
    return await this.prisma.screen.findUnique({
      where: { id },
      include: {
        movieSchedules: true,
        seats: true,
      },
    });
  }

  async update(id: string, updateScreenDto: UpdateScreenDto) {
    return await this.prisma.screen.update({
      where: { id },
      data: updateScreenDto,
    });
  }

  async deleteById(id: string) {
    return await this.prisma.screen.delete({
      where: { id },
    });
  }
}
