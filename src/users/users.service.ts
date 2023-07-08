import { Injectable, NotFoundException } from '@nestjs/common';
import { ProviderType, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserInfo } from 'src/types/user-info';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserInfo> {
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(createUserDto.password, salt);

    createUserDto.password = hashedPwd;

    const user = await this.usersRepository.create({ data: createUserDto });

    const { password, ...result } = user;
    return result as UserInfo;
  }

  async findAll(): Promise<UserInfo[]> {
    const users = await this.usersRepository.findMany();
    const results: UserInfo[] = users.map((user) => {
      const { password, ...result } = user;
      return result as UserInfo;
    });
    return results;
  }

  async findOne(id: string): Promise<UserInfo> {
    const user = await this.usersRepository.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    const { password, ...result } = user;
    return result as UserInfo;
  }

  async findUserOnRegister(
    email: string,
    name: string,
    phone: string,
  ): Promise<User> {
    const exUser = await this.usersRepository.findFirst({
      where: {
        OR: [{ email }, { name }, { phone }],
      },
    });
    return exUser;
  }

  async findWithEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findFirst({
      where: {
        email,
        provider: ProviderType.LOCAL,
      },
    });

    if (!user) throw new NotFoundException('유저 정보가 존재하지 않습니다.');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserInfo> {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPwd = await bcrypt.hash(updateUserDto.password, salt);
      updateUserDto.password = hashedPwd;
    }

    const user = await this.usersRepository.update({
      where: { id },
      data: updateUserDto,
    });

    const { password, ...result } = user;

    return result as UserInfo;
  }

  async remove(id: string): Promise<UserInfo> {
    const user = await this.usersRepository.delete({ where: { id } });

    const { password, ...result } = user;

    return result as UserInfo;
  }
}
