import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderType, User } from '@prisma/client';
import authConfig from 'src/config/auth.config';
import emailConfig from 'src/config/email.config';
import { EmailService } from 'src/email/email.service';
import { ConfigValidationSchhma } from 'src/lib/schemas/config.schema';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { TokenRepository } from './repository/token.repository';

describe('AuthService', () => {
  let user: User;
  let authService: AuthService;
  let createUserDto: CreateUserDto;
  let loginDto: LoginDto;
  let verifyEmailDto: VerifyEmailDto;

  const authConfigMock = {
    jwtSecret: process.env.JWT_SECRET,
    kakaoClientId: process.env.KAKAO_CLIENT_ID,
    kakaoCallbackUrl: process.env.KAKAO_CALLBACK_URL,
    clientUrl: process.env.CLIENT_URL,
  };

  let findUserOnRegisterMock: jest.Mock;
  beforeEach(async () => {
    user = {
      id: 'test',
      email: 'test@test.com',
      name: 'tester',
      password: 'testttttttttttttttt',
      createdAt: new Date(),
      role: 1,
      provider: ProviderType.LOCAL,
      isVerified: true,
      phone: '01000000000',
      snsId: null,
      image: null,
    };
    findUserOnRegisterMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenRepository,
          useValue: {
            createWithUserId: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findUserOnRegister: findUserOnRegisterMock,
            create: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendMemberJoinVerification: jest.fn().mockResolvedValue(null),
          },
        },
      ],
      imports: [
        ConfigModule.forRoot({
          load: [emailConfig, authConfig],
          isGlobal: true,
          validationSchema: ConfigValidationSchhma,
        }),
        PrismaModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'secret',
          signOptions: { expiresIn: '7d' },
        }),
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  // describe('register 함수 호출', () => {
  //   it('입력값이 올바르지 않다면,  validation error를 호출해야 한다.', () => {
  //     const badCreateUserDto = {
  //       email: 'test@test.com',
  //     };
  //     expect(
  //       async () =>
  //         await authService.register(badCreateUserDto as CreateUserDto),
  //     ).rejects.toThrow(HttpException);
  //     expect(authService.saveUser).toBeCalledTimes(0);
  //     expect(authService.sendMemberJoinEmail).toBeCalledTimes(0);
  //   });
  //   describe('입력값이 올바르다면', () => {
  //     beforeEach(() => {
  //       createUserDto = {
  //         email: 'test@test.com',
  //         name: 'tester',
  //         password: 'testttttttttttttttt',
  //         phone: '01000000000',
  //       };
  //     });
  //     it('user가 이미 존재한다면, 에러를 호출해야 한다.', () => {
  //       findUserOnRegisterMock.mockResolvedValue(user);
  //       expect(
  //         async () => await authService.register(createUserDto),
  //       ).rejects.toThrow(UnprocessableEntityException);
  //     });

  //     it('유저가 존재하지 않다면, 유저를 저장하고 이메일을 보내야한다.', async () => {
  //       await expect(
  //         authService.register(createUserDto),
  //       ).resolves.toBeUndefined();

  //       expect(authService.saveUser).toBeCalledTimes(1);
  //       expect(authService.saveUser).toHaveBeenCalledWith(
  //         createUserDto,
  //         expect.any(String),
  //       );
  //       expect(authService.sendMemberJoinEmail).toBeCalledTimes(1);
  //       expect(authService.sendMemberJoinEmail).toHaveBeenCalledWith(
  //         createUserDto.email,
  //         expect.any(String),
  //       );
  //     });
  //   });
  // });
});
