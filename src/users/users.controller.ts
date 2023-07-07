import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BaseResponse } from 'src/types/response/base-response.dto';
import { GetAllUsersResponse } from 'src/types/response/users/get-all-users.dto';
import { GetUserResponse } from 'src/types/response/users/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsAdminGuard } from './guards/isAdmin.guard';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@UseGuards(IsAdminGuard)
export class UsersController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '어드민 - 유저 생성' })
  @ApiCreatedResponse({ type: GetAllUsersResponse })
  async create(@Body() createUserDto: CreateUserDto): Promise<GetUserResponse> {
    const user = await this.usersService.create(createUserDto);
    this.logger.log(`${user.name}(${user.id}) - 유저 생성`);
    return {
      ok: true,
      msg: `${user.name}(${user.id}) - 유저 생성`,
      status: 201,
      data: user,
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '어드민 - 모든 유저 정보 가져오기' })
  @ApiOkResponse({ type: GetAllUsersResponse })
  async findAll(): Promise<GetAllUsersResponse> {
    const users = await this.usersService.findAll();
    return {
      ok: true,
      msg: `모든 유저 정보`,
      status: 200,
      data: users,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '어드민 - 유저 정보 가져오기' })
  @ApiOkResponse({ type: GetUserResponse })
  async findOne(@Param('id') id: string): Promise<GetUserResponse> {
    const user = await this.usersService.findOne(id);
    return {
      ok: true,
      msg: `${user.name}(${user.id}) - 유저 정보`,
      status: 200,
      data: user,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '어드민 - 유저 정보 업데이트' })
  @ApiCreatedResponse({ type: GetUserResponse })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserResponse> {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      ok: true,
      msg: `${user.name}(${user.id}) - 유저 정보 업데이트`,
      status: 201,
      data: user,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '어드민 - 유저 정보 삭제' })
  @ApiCreatedResponse({ type: BaseResponse })
  async remove(@Param('id') id: string): Promise<BaseResponse> {
    this.logger.log('유저 삭제');
    const user = await this.usersService.remove(id);
    return {
      ok: true,
      msg: `${user.name}(${user.id}) - 유저 삭제`,
      status: 201,
    };
  }
}
