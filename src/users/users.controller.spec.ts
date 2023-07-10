import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { LoggerModule } from 'src/logger/logger.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersRepository } from './repository/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let user: User;

  beforeEach(async () => {
    // user = {
    //   id: 'test',
    //   email: 'test@test.com',
    //   name: 'tester',
    //   password: 'testttttttttttttttt',
    //   createdAt: new Date(),
    //   role: 1,
    //   provider: ProviderType.LOCAL,
    //   isVerified: true,
    //   phone: '01000000000',
    //   snsId: null,
    //   image: null,
    // };

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, PrismaModule],
      controllers: [UsersController],
      providers: [UsersService, UsersRepository],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
});
