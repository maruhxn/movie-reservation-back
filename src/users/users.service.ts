import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(createUserDto.password, salt);

    createUserDto.password = hashedPwd;

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    const results = users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
    return {
      ok: true,
      msg: `모든 유저 정보`,
      status: 200,
      data: results,
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    const { password, ...result } = user;
    return {
      ok: true,
      msg: `${user.name}(${user.id}) - 유저 정보`,
      status: 200,
      data: result,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPwd = await bcrypt.hash(updateUserDto.password, salt);
      updateUserDto.password = hashedPwd;
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
