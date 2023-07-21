import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderType, User } from '@prisma/client';
import { LoggerModule } from 'src/logger/logger.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './repository/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let validationPipe: ValidationPipe;
  let user: User;

  beforeEach(async () => {
    user = {
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

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, PrismaModule],
      controllers: [UsersController],
      providers: [UsersService, UsersRepository],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('입력값이 올바르다면', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        name: 'tester',
        phone: '01000000000',
        password: 'testttttttttttttttt',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(user);

      const result = await usersController.create(dto);
      expect(result.data).toBeInstanceOf(UserEntity);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {
        email: 'test@test.com',
        name: 'tester',
        phone: '01000000000',
        password: '',
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

  describe('findAll', () => {
    it('모든 유저 정보를 받아와 UserEntity 배열로 반환', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([user]);

      const result = await usersController.findAll();
      const users = result.data;
      expect(users).toBeInstanceOf(Array);
      const allUsersAreInstanceOfUserEntity = users.every(
        (user) => user instanceof UserEntity,
      );
      expect(allUsersAreInstanceOfUserEntity).toBeTruthy();
    });
  });

  describe('findById', () => {
    it('id와 일치하는 유저 정보 반환', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      const result = await usersController.findById(user.id);
      expect(result.data).toBeInstanceOf(UserEntity);
    });
  });

  describe('update', () => {
    it('입력값이 올바르다면', async () => {
      const dto: UpdateUserDto = {
        email: '1@test.com',
        name: '111111',
        phone: '01000000000',
        password: '111111111',
      };

      const updatedUser = {
        ...user,
        ...dto,
      };

      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);

      const result = await usersController.update('test', dto);
      expect(result.data).toMatchObject(updatedUser);
    });
    it('입력값이 올바르지 않다면, validation error 발생', async () => {
      const dto = {
        email: '',
        name: 'tester',
        phone: '01000000000',
        password: '',
      };

      try {
        await validationPipe.transform(dto, {
          metatype: UpdateUserDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deleteById', () => {
    it('id가 올바르다면 유저 삭제', async () => {
      jest.spyOn(usersService, 'deleteById').mockResolvedValue(user);
      const result = await usersController.deleteById(user.id);
      expect(result.status).toEqual(201);
    });
  });
});
