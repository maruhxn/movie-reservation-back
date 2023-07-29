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
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { IsEmailVerifiedGuard } from 'src/auth/guards/isEmailVerified.guard';
import { BaseResponse } from 'src/types/response/base-response.dto';
import { GetAllReservationsResponse } from 'src/types/response/reservations/get-all-reservations.dto';
import { GetReservationResponse } from 'src/types/response/reservations/get-reservation.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { IsAdminGuard } from 'src/users/guards/isAdmin.guard';
import { ScreenService } from './../screen/screen.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';

@UseGuards(IsEmailVerifiedGuard)
@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly screenService: ScreenService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '예매 완료' })
  @ApiCreatedResponse({ type: GetReservationResponse })
  async create(
    @GetUser() user: UserEntity,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    const reservation = new ReservationEntity(
      await this.reservationsService.create(user.id, createReservationDto),
    );
    return {
      ok: true,
      msg: `${reservation.user.name}(${reservation.userId}) - 유저 예매 완료(${reservation.id})`,
      status: 201,
      data: reservation,
    };
  }

  @UseGuards(IsAdminGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '모든 예매 정보' })
  @ApiOkResponse({ type: GetAllReservationsResponse })
  async findAll() {
    const reservations = await this.reservationsService.findAll();
    const results = reservations.map(
      (reservation) => new ReservationEntity(reservation),
    );
    return {
      ok: true,
      msg: `모든 예매 정보`,
      status: 200,
      data: results,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '예매 정보 가져오기' })
  @ApiOkResponse({ type: GetReservationResponse })
  async findById(@Param('id') id: string) {
    const reservation = await this.reservationsService.findById(id);
    return {
      ok: true,
      msg: `${reservation.user.name}(${reservation.userId}) - 유저 예매 정보(${reservation.id})`,
      status: 200,
      data: reservation,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '예매 정보 업데이트' })
  @ApiCreatedResponse({ type: GetReservationResponse })
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const reservation = new ReservationEntity(
      await this.reservationsService.update(id, updateReservationDto),
    );
    return {
      ok: true,
      msg: `${reservation.user.name}(${reservation.userId}) - 유저 예매 정보 업데이트(${reservation.id})`,
      status: 201,
      data: reservation,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '예매 정보 삭제' })
  @ApiCreatedResponse({ type: BaseResponse })
  async deleteById(@Param('id') id: string) {
    const reservation = new ReservationEntity(
      await this.reservationsService.deleteById(id),
    );
    return {
      ok: true,
      msg: `${reservation.user.name}(${reservation.userId}) - 유저 예매 정보 삭제(${reservation.id})`,
      status: 201,
    };
  }
}
