import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: CreateUserDto }) {
    const { data } = params;
    return await this.prisma.user.create({ data });
  }

  async findMany(params?: Prisma.UserFindManyArgs) {
    return await this.prisma.user.findMany(params);
  }

  async findFirst(params: Prisma.UserFindFirstArgs) {
    return await this.prisma.user.findFirst(params);
  }

  async findUnique(params: Prisma.UserFindUniqueArgs) {
    return await this.prisma.user.findUnique(params);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }) {
    const { where, data } = params;
    return await this.prisma.user.update({ where, data });
  }

  async delete(params: Prisma.UserDeleteArgs) {
    return await this.prisma.user.delete(params);
  }
}
