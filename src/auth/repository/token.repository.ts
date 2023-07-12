import { Injectable } from '@nestjs/common';
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

  async findVerifiedTokenByPayload(oneDayAgo: Date, signupVerifyToken: string) {
    return await this.prisma.token.findFirst({
      where: {
        createdAt: {
          gte: oneDayAgo,
        },
        payload: signupVerifyToken,
      },
      include: {
        user: true,
      },
    });
  }

  async deleteManyByUserId(userId: string) {
    return await this.prisma.token.deleteMany({
      where: {
        userId,
      },
    });
  }
}
