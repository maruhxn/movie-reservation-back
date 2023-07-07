import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  LoggerService,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoginResponse } from 'src/types/response/auth/login.dto';
import { BaseResponse } from 'src/types/response/base-response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserInfo } from '../types/user-info';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: BaseResponse,
  })
  @Post('')
  async register(@Body() dto: CreateUserDto): Promise<BaseResponse> {
    this.logger.log(`회원가입. Payload: ${JSON.stringify(dto)}`);
    await this.authService.register(dto);
    return { ok: true, status: 201, msg: '회원가입 성공' };
  }

  @ApiOperation({ summary: '이메일 인증' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({
    status: 201,
    description: '이메일 인증 성공',
    type: LoginResponse,
  })
  @Post('email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<LoginResponse> {
    const accessToken = await this.authService.verifyEmail(dto);
    return {
      ok: true,
      status: 201,
      msg: '이메일 인증 성공',
      data: { accessToken },
    };
  }

  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: LoginResponse,
  })
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    this.logger.log(`로그인. Payload: ${JSON.stringify(dto)}`);
    const accessToken = await this.authService.login(dto);
    return {
      ok: true,
      status: 201,
      msg: '로그인 성공',
      data: { accessToken },
    };
  }

  @ApiOperation({ summary: '카카오 로그인' })
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @ApiOperation({ summary: '카카오 로그인 콜백' })
  @Get('kakao/callback')
  @ApiResponse({
    status: 302,
    description: '카카오 로그인 성공 - Redirection',
  })
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`카카오 로그인. Payload: ${JSON.stringify(req.user)}`);
    return this.authService.kakaoLogin(req, res);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiResponse({
    status: 201,
    description: '회원 탈퇴 성공',
    type: BaseResponse,
  })
  @Delete('edit/delete')
  @UseGuards(AuthGuard())
  async deleteUser(@GetUser() user: UserInfo): Promise<BaseResponse> {
    this.logger.log(`회원 탈퇴 - ${user.name}(${user.id})}`);
    await this.authService.deleteUser(user);
    return {
      ok: true,
      msg: `${user.name}(${user.id}) - 회원 탈퇴`,
      status: 201,
    };
  }
}
