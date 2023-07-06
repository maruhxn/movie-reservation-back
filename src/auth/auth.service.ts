import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseResponse } from 'src/types/response/base-response.dto';
import { UsersService } from './../users/users.service';

import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ProviderType } from '@prisma/client';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import authConfig from 'src/config/auth.config';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginResponse } from 'src/types/response/auth/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as uuid from 'uuid';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './user-info';

@Injectable()
export class AuthService {
  private CLIENT_URL: string;
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,
  ) {
    this.CLIENT_URL = config.clientUrl;
  }

  async register(createUserDto: CreateUserDto): Promise<BaseResponse> {
    const exUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { name: createUserDto.name },
          { phone: createUserDto.phone },
        ],
      },
    });
    if (exUser)
      throw new UnprocessableEntityException(
        '해당 이메일 또는 이름으로는 가입할 수 없습니다.',
      );

    const signupVerifyToken = uuid.v1();

    await this.saveUser(createUserDto, signupVerifyToken);
    await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);
    return { ok: true, status: 201, msg: '회원가입 성공' };
  }

  private async saveUser(
    createUserDto: CreateUserDto,
    signupVerifyToken: string,
  ): Promise<void> {
    const user = await this.usersService.create(createUserDto);
    await this.prisma.token.create({
      data: {
        payload: signupVerifyToken,
        userId: user.id,
      },
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    return await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<LoginResponse> {
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

    const payload: UserInfo = {
      userId: token.userId,
      name: token.user.name,
      email: token.user.email,
    };
    await this.prisma.token.deleteMany({
      where: {
        userId: token.userId,
      },
    });
    const accessToken = this.jwtService.sign(payload);

    return {
      ok: true,
      status: 201,
      msg: '이메일 인증 성공',
      data: { accessToken },
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        provider: ProviderType.LOCAL,
      },
    });

    console.log(user);

    if (!user) throw new NotFoundException('유저 정보가 존재하지 않습니다.');

    const isValid = await compare(password, user.password);
    if (isValid) {
      const payload: UserInfo = {
        userId: user.id,
        email: user.email,
        name: user.name,
      };
      const accessToken = this.jwtService.sign(payload);

      return {
        ok: true,
        status: 201,
        msg: '로그인 성공',
        data: { accessToken },
      };
    } else {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
  }
  kakaoLogin(req: Request, res: Response): void {
    const accessToken = this.jwtService.sign(req.user as UserInfo);
    return res.redirect(`${this.CLIENT_URL}/?accessToken=${accessToken}`);
  }

  async deleteUser(user: UserInfo): Promise<BaseResponse> {
    const exUser = await this.prisma.user.findFirst({
      where: { id: user.userId },
    });

    if (!exUser) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    await this.prisma.user.delete({
      where: {
        id: exUser.id,
      },
    });

    return {
      ok: true,
      msg: `${exUser.name}(${exUser.id}) - 회원 탈퇴`,
      status: 201,
    };
  }
}
