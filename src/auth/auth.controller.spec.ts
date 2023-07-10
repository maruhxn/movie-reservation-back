import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import authConfig from 'src/config/auth.config';
import emailConfig from 'src/config/email.config';
import movieConfig from 'src/config/movie.config';
import { EmailModule } from 'src/email/email.module';
import { ConfigValidationSchhma } from 'src/lib/schemas/config.schema';
import { LoggerModule } from 'src/logger/logger.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenRepository } from './repository/token.repository';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

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

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // describe('register', () => {
  //   it('should throw UnprocessableEntityException, if user already exists', async () => {
  //     const exUser = true;
  //     jest
  //       .spyOn(authService, 'register')
  //       .mockImplementation(() => exUser);

  //     expect(await authController.findAll()).toBe(result);
  //   });
  // });
});
