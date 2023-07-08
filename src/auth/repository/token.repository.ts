import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private prisma: PrismaService) {}

  async createWithUserId(signupVerifyToken: string, userId: string) {
    return await this.prisma.token.create({
      data: {
        payload: signupVerifyToken,
        userId,
      },
    });
  }

  async findFirst(params: Prisma.TokenFindFirstArgs) {
    return await this.prisma.token.findFirst(params);
  }

  async deleteMany(parmas: Prisma.TokenDeleteManyArgs) {
    return await this.prisma.token.deleteMany(parmas);
  }
}
