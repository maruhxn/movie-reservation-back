import {
  Body,
  Controller,
  Delete,
  Get,
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
import { BaseResponse } from 'src/types/response/base-response.dto';
import { GetAllScreensResponse } from 'src/types/response/screen/get-all-screens.dto';
import { GetScreenResponse } from 'src/types/response/screen/get-screen.dto';
import { IsAdminGuard } from 'src/users/guards/isAdmin.guard';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ScreenEntity } from './entities/screen.entity';
import { ScreenService } from './screen.service';

@ApiTags('Screen')
@Controller('screen')
@UseGuards(IsAdminGuard)
export class ScreenController {
  constructor(private readonly screenService: ScreenService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '상영관 생성' })
  @ApiCreatedResponse({ type: GetAllScreensResponse })
  async create(
    @Body() createScreenDto: CreateScreenDto,
  ): Promise<GetScreenResponse> {
    const screen = new ScreenEntity(
      await this.screenService.create(createScreenDto),
    );
    return {
      ok: true,
      msg: `${screen.screenNum}(${screen.id}) - 상영관 생성`,
      status: 201,
      data: screen,
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '모든 상영관 정보 가져오기' })
  @ApiOkResponse({ type: GetAllScreensResponse })
  async findAll(): Promise<GetAllScreensResponse> {
    const screens = await this.screenService.findAll();
    const results = screens.map((screen) => new ScreenEntity(screen));
    return {
      ok: true,
      msg: `모든 상영관 정보`,
      status: 200,
      data: results,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '상영관 정보 가져오기' })
  @ApiOkResponse({ type: GetScreenResponse })
  async findById(@Param('id') id: string): Promise<GetScreenResponse> {
    const screen = new ScreenEntity(await this.screenService.findById(id));
    return {
      ok: true,
      msg: `${screen.screenNum}(${screen.id}) - 상영관 정보`,
      status: 200,
      data: screen,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '상영관 정보 업데이트' })
  @ApiCreatedResponse({ type: GetScreenResponse })
  async update(
    @Param('id') id: string,
    @Body() updateScreenDto: UpdateScreenDto,
  ): Promise<GetScreenResponse> {
    const screen = new ScreenEntity(
      await this.screenService.update(id, updateScreenDto),
    );
    return {
      ok: true,
      msg: `${screen.screenNum}(${screen.id}) - 상영관 정보 업데이트`,
      status: 201,
      data: screen,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '상영관 정보 삭제' })
  @ApiCreatedResponse({ type: BaseResponse })
  async deleteById(@Param('id') id: string): Promise<BaseResponse> {
    const screen = new ScreenEntity(await this.screenService.deleteById(id));
    return {
      ok: true,
      msg: `${screen.screenNum}(${screen.id}) - 상영관 삭제`,
      status: 201,
    };
  }
}
