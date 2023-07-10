import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { TokenRepository } from './repository/token.repository';

import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ProviderType } from '@prisma/client';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import authConfig from 'src/config/auth.config';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as uuid from 'uuid';
import { UserInfo } from '../types/user-info';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  private CLIENT_URL: string;
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenRepository: TokenRepository,
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,
  ) {
    this.CLIENT_URL = config.clientUrl;
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    const exUser = await this.usersService.findUserOnRegister(
      createUserDto.email,
      createUserDto.name,
      createUserDto.phone,
    );

    if (exUser)
      throw new UnprocessableEntityException(
        '해당 이메일, 전화번호 또는 이름으로는 가입할 수 없습니다.',
      );

    const signupVerifyToken = uuid.v1();

    await this.saveUser(createUserDto, signupVerifyToken);
    await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);
    return;
  }

  async saveUser(
    createUserDto: CreateUserDto,
    signupVerifyToken: string,
  ): Promise<void> {
    const user = await this.usersService.create(createUserDto);
    await this.tokenRepository.createWithUserId(signupVerifyToken, user.id);
  }

  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    return await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = verifyEmailDto;
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const token = await this.prisma.token.findFirst({
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

    if (!token) throw new NotFoundException('토큰 정보가 존재하지 않습니다.');

    await this.usersService.update(token.userId, { isVerified: true });

    const payload = { userId: token.userId };
    await this.prisma.token.deleteMany({
      where: {
        userId: token.userId,
      },
    });
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        provider: ProviderType.LOCAL,
      },
    });

    if (!user) throw new NotFoundException('유저 정보가 존재하지 않습니다.');

    const isValid = await compare(password, user.password);
    if (isValid) {
      const payload = { userId: user.id };

      const accessToken = this.jwtService.sign(payload);

      return accessToken;
    } else {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
  }
  kakaoLogin(req: Request, res: Response): void {
    const accessToken = this.jwtService.sign(req.user as UserInfo);
    return res.redirect(`${this.CLIENT_URL}/?accessToken=${accessToken}`);
  }

  async deleteUser(user: UserInfo): Promise<void> {
    await this.usersService.remove(user.id);
    return;
  }
}
