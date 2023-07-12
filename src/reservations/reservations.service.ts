import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './repository/reservation.repository';

@Injectable()
export class ReservationsService {
  constructor(private reservationRepository: ReservationRepository) {}
  async create(userId: string, createReservationDto: CreateReservationDto) {
    if (createReservationDto.personAmt !== createReservationDto.seats.length)
      throw new BadRequestException('인원 수에 맞도록 좌석을 선택해주세요');
    return await this.reservationRepository.createReservation(
      userId,
      createReservationDto,
    );
  }

  async findAll(whereParam?: any) {
    return await this.reservationRepository.findAll(whereParam);
  }

  async findById(id: string) {
    return await this.reservationRepository.findById(id);
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    if (updateReservationDto.personAmt !== updateReservationDto.seats.length)
      throw new BadRequestException('인원 수에 맞도록 좌석을 선택해주세요');
    const reservation = await this.reservationRepository.update(
      id,
      updateReservationDto,
    );
    if (!reservation) throw new NotFoundException('예약 정보가 없습니다.');
    return reservation;
  }

  async deleteById(id: string) {
    const reservation = await this.reservationRepository.deleteById(id);
    if (!reservation) throw new NotFoundException('예약 정보가 없습니다.');
    return reservation;
  }
}
