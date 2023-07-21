import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderType } from '@prisma/client';
import authConfig from 'src/config/auth.config';
import emailConfig from 'src/config/email.config';
import movieConfig from 'src/config/movie.config';
import { EmailModule } from 'src/email/email.module';
import { ConfigValidationSchhma } from 'src/lib/schemas/config.schema';
import { LoggerModule } from 'src/logger/logger.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { TokenRepository } from './repository/token.repository';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let validationPipe: ValidationPipe;
  const accessToken = 'accessToken';
  const user = {
    id: 'test',
    email: 'test@test.com',
    name: 'tester',
    password: 'hashedPassword',
    createdAt: new Date(),
    role: 1,
    provider: ProviderType.LOCAL,
    isVerified: true,
    phone: '01000000000',
    snsId: null,
    image: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [emailConfig, authConfig, movieConfig],
          isGlobal: true,
          validationSchema: ConfigValidationSchhma,
        }),
        LoggerModule,
        PrismaModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'secret',
          signOptions: { expiresIn: '7d' },
        }),
        UsersModule,
        EmailModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, TokenRepository],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('입력값이 올바르다면', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        name: 'tester',
        phone: '01000000000',
        password: 'testttttttttttttttt',
      };

      jest.spyOn(service, 'register').mockResolvedValue(null);

      const result = await controller.register(dto);
      expect(result.status).toEqual(201);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto: CreateUserDto = {
        email: 'test',
        name: 'tester',
        phone: '01000000000',
        password: 'd',
      };

      try {
        await validationPipe.transform(dto, {
          metatype: CreateUserDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('verifyEmail', () => {
    it('올바른 verify token을 입력받으면 이메일 인증 성공', async () => {
      const dto: VerifyEmailDto = {
        signupVerifyToken: 'signupVerifyToken',
      };
      jest.spyOn(service, 'verifyEmail').mockResolvedValue(accessToken);

      const result = await controller.verifyEmail(dto);
      expect(result.data).toMatchObject({ accessToken });
    });
  });

  describe('login', () => {
    it('올바른 입력값이 들어오면, accessToken 반환', async () => {
      const dto: LoginDto = {
        email: 'test@test.com',
        password: 'testttttttttttttttt',
      };
      jest.spyOn(service, 'login').mockResolvedValue(accessToken);
      const result = await controller.login(dto);
      expect(result.data).toMatchObject({ accessToken });
    });
    it('올바르지 않은 입력값이 들어오면, validation error 발생', async () => {
      const dto = {};

      try {
        await validationPipe.transform(dto, {
          metatype: LoginDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deleteUser', () => {
    it('id가 올바르다면 유저 삭제', async () => {
      jest.spyOn(service, 'deleteUser').mockResolvedValue(null);
      const result = await controller.deleteUser(new UserEntity(user));
      expect(result.status).toEqual(201);
    });
  });
});
