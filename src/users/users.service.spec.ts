import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderType, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;
  let validationPipe: ValidationPipe;

  const user: User = {
    id: 'test',
    email: 'test@test.com',
    name: 'tester',
    createdAt: new Date(),
    password: 'hashedPassword',
    role: 1,
    provider: ProviderType.LOCAL,
    isVerified: true,
    phone: '01000000000',
    snsId: null,
    image: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersService, UsersRepository],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let repositoryCreateMock;

    beforeEach(() => {
      repositoryCreateMock = jest.spyOn(usersRepository, 'create');
    });

    it('입력값에 아무 문제 없다면, 비밀번호를 제외한 유저 정보를 리턴', async () => {
      const createUserDto = {
        email: 'test@test.com',
        name: 'tester',
        password: 'testttttttttttttttt',
        phone: '01000000000',
      };
      repositoryCreateMock.mockResolvedValue(user);
      const result = await service.create(createUserDto);
      expect(repositoryCreateMock).toBeCalledTimes(1);
      expect(repositoryCreateMock).toBeCalledWith(createUserDto);
      expect(result).toEqual(user);
    });

    it('입력값에 문제가 있다면, 에러', async () => {
      const invalidCreateUserDto = {};

      try {
        await validationPipe.transform(invalidCreateUserDto, {
          metatype: CreateUserDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(repositoryCreateMock).toBeCalledTimes(0);
      }
    });
  });

  describe('findAll', () => {
    let repositoryFindManyMock;
    beforeEach(() => {
      repositoryFindManyMock = jest.spyOn(usersRepository, 'findAll');
    });

    it('비밀번호를 제외한 유저 정보 배열을 리턴', async () => {
      repositoryFindManyMock.mockResolvedValue([user]);
      const results = await service.findAll();
      expect(repositoryFindManyMock).toBeCalledTimes(1);
      expect(results).toEqual([user]);
    });
  });

  describe('findOne', () => {
    let repositoryFindUniqueMock;
    beforeEach(() => {
      repositoryFindUniqueMock = jest.spyOn(usersRepository, 'findById');
    });

    it('비밀번호를 제외한 유저 정보 리턴', async () => {
      repositoryFindUniqueMock.mockResolvedValue(user);
      const result = await service.findById('test');
      expect(repositoryFindUniqueMock).toBeCalledTimes(1);
      expect(repositoryFindUniqueMock).toBeCalledWith('test');
      expect(result).toEqual(user);
    });
  });

  describe('findUserOnRegister', () => {
    let repositoryFindFirstMock;
    beforeEach(() => {
      repositoryFindFirstMock = jest.spyOn(
        usersRepository,
        'findUserOnRegister',
      );
    });

    it('유저 객체 리턴', async () => {
      repositoryFindFirstMock.mockResolvedValue(user);
      const result = await service.findUserOnRegister('test', 'test', 'test');
      expect(repositoryFindFirstMock).toBeCalledTimes(1);
      expect(repositoryFindFirstMock).toBeCalledWith('test', 'test', 'test');
      expect(result).toEqual(user);
    });
  });

  describe('udpate', () => {
    let repositoryUpdateMock;

    beforeEach(() => {
      repositoryUpdateMock = jest.spyOn(usersRepository, 'update');
    });

    it('입력값에 아무 문제 없다면, 비밀번호를 제외한 유저 정보를 리턴', async () => {
      const hashMock = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => 'hashedPassword');

      const updateUserDto = {
        email: '1@test.com',
        name: '1',
        password: '111111',
        phone: '11111111',
      };

      const updatedUser = {
        ...updateUserDto,
        password: 'hashedPassword',
      };

      repositoryUpdateMock.mockResolvedValue(updatedUser);
      const result = await service.update('test', updateUserDto);
      expect(repositoryUpdateMock).toBeCalledTimes(1);
      expect(repositoryUpdateMock).toBeCalledWith('test', updateUserDto);
      expect(hashMock).toBeCalledTimes(1);
      expect(result).toEqual(updatedUser);
    });

    it('입력값에 문제가 있다면, 에러', async () => {
      const invalidUpdateUserDto = {};

      try {
        await validationPipe.transform(invalidUpdateUserDto, {
          metatype: CreateUserDto,
          type: 'body',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(repositoryUpdateMock).toBeCalledTimes(0);
      }
    });
  });

  describe('remove', () => {
    let repositoryDeleteMock;

    beforeEach(() => {
      repositoryDeleteMock = jest.spyOn(usersRepository, 'deleteById');
    });

    it('id에 해당하는 user 삭제 후 비밀번호를 제외한 정보 반환', async () => {
      repositoryDeleteMock.mockResolvedValue(user);
      const result = await service.deleteById('test');
      expect(repositoryDeleteMock).toBeCalledTimes(1);
      expect(repositoryDeleteMock).toBeCalledWith('test');
      expect(result).toEqual(user);
    });
  });
});
