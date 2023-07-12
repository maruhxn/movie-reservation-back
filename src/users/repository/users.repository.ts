import { Injectable } from '@nestjs/common';
import { Prisma, ProviderType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateKakaoUserDto } from './../dto/create-kakao-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({ data: createUserDto });
  }

  async createKakaoUser(createKakaoUserDto: CreateKakaoUserDto) {
    return await this.prisma.user.create({ data: createKakaoUserDto });
  }

  async findAll(params?: Prisma.UserFindManyArgs) {
    return await this.prisma.user.findMany(params);
  }

  async findUserOnRegister(email: string, name: string, phone: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { name }, { phone }],
      },
    });
  }

  async findByEmail(email: string, provider?: ProviderType) {
    const whereData = provider ? { email, provider } : { email };
    return await this.prisma.user.findFirst({
      where: {
        ...whereData,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto as any, // 어케 하지
    });
  }

  async deleteById(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
