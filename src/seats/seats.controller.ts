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
import { GetAllSeatsResponse } from 'src/types/response/seats/get-all-seats.dto';
import { GetSeatResponse } from 'src/types/response/seats/get-seat.dto';
import { IsAdminGuard } from 'src/users/guards/isAdmin.guard';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { SeatEntity } from './entities/seat.entity';
import { SeatsService } from './seats.service';

@ApiTags('Seats')
@Controller('seats')
@UseGuards(IsAdminGuard)
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '좌석 생성' })
  @ApiCreatedResponse({ type: GetSeatResponse })
  async create(@Body() createSeatDto: CreateSeatDto) {
    const seat = new SeatEntity(await this.seatsService.create(createSeatDto));
    return {
      ok: true,
      msg: `${seat.name}(${seat.id}) - 좌석 생성`,
      status: 201,
      data: seat,
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '모든 좌석 정보 가져오기' })
  @ApiOkResponse({ type: GetAllSeatsResponse })
  async findAll() {
    const seats = await this.seatsService.findAll();
    const results = seats.map((seat) => new SeatEntity(seat));
    return {
      ok: true,
      msg: `모든 좌석 정보`,
      status: 200,
      data: results,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '좌석 정보 가져오기' })
  @ApiOkResponse({ type: GetSeatResponse })
  async findById(@Param('id') id: string) {
    const seat = new SeatEntity(await this.seatsService.findById(id));
    return {
      ok: true,
      msg: `${seat.name}(${seat.id})- 좌석 정보`,
      status: 200,
      data: seat,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '좌석 정보 업데이트' })
  @ApiCreatedResponse({ type: GetSeatResponse })
  async update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    const seat = new SeatEntity(
      await this.seatsService.update(id, updateSeatDto),
    );
    return {
      ok: true,
      msg: `${seat.name}(${seat.id})- 좌석 정보 업데이트`,
      status: 201,
      data: seat,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '좌석 정보 삭제' })
  @ApiCreatedResponse({ type: BaseResponse })
  async deleteById(@Param('id') id: string) {
    const seat = new SeatEntity(await this.seatsService.deleteById(id));
    return {
      ok: true,
      msg: `${seat.name}(${seat.id}) - 좌석 삭제`,
      status: 201,
    };
  }
}
