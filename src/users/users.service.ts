import { Injectable, NotFoundException } from '@nestjs/common';
import { ProviderType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateKakaoUserDto } from './dto/create-kakao-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(createUserDto.password, salt);

    createUserDto.password = hashedPwd;

    const user = await this.usersRepository.create(createUserDto);

    return user;
  }

  async createUserWithKakao(createKakaoUserDto: CreateKakaoUserDto) {
    const user = this.usersRepository.createKakaoUser(createKakaoUserDto);
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users;
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    return user;
  }

  async findByEmail(email: string, provider?: ProviderType) {
    const user = await this.usersRepository.findByEmail(email, provider);
    return user;
  }

  async findUserOnRegister(email: string, name: string, phone: string) {
    const exUser = await this.usersRepository.findUserOnRegister(
      email,
      name,
      phone,
    );

    return exUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPwd = await bcrypt.hash(updateUserDto.password, salt);
      updateUserDto.password = hashedPwd;
    }

    const user = await this.usersRepository.update(id, updateUserDto);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return user;
  }

  async deleteById(id: string) {
    const user = await this.usersRepository.deleteById(id);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return user;
  }
}
