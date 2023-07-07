import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/types/user-info';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserInfo> {
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(createUserDto.password, salt);

    createUserDto.password = hashedPwd;

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    const { password, ...result } = user;
    return result as UserInfo;
  }

  async findAll(): Promise<UserInfo[]> {
    const users = await this.prisma.user.findMany();
    const results: UserInfo[] = users.map((user) => {
      const { password, ...result } = user;
      return result as UserInfo;
    });
    return results;
  }

  async findOne(id: string): Promise<UserInfo> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    const { password, ...result } = user;
    return result as UserInfo;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserInfo> {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPwd = await bcrypt.hash(updateUserDto.password, salt);
      updateUserDto.password = hashedPwd;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    const { password, ...result } = user;

    return result as UserInfo;
  }

  async remove(id: string): Promise<UserInfo> {
    const user = await this.prisma.user.delete({ where: { id } });

    const { password, ...result } = user;

    return result as UserInfo;
  }
}
