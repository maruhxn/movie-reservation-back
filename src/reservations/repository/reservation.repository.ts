import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './../dto/create-reservation.dto';
import { UpdateReservationDto } from './../dto/update-reservation.dto';

@Injectable()
export class ReservationRepository {
  constructor(private prisma: PrismaService) {}

  async createReservation(
    userId: string,
    createReservationDto: CreateReservationDto,
  ) {
    console.log(createReservationDto, userId);
    const { movieScheduleId, personAmt, seats } = createReservationDto;
    const reservation = await this.prisma.reservation.create({
      data: {
        personAmt,
        movieScheduleId,
        userId,
        seats: {
          connect: seats.map((id) => ({ id })),
        },
      },
      include: {
        movieSchedule: true,
        seats: true,
        user: true,
      },
    });
    return reservation;
  }

  async findAll(params?: Prisma.ReservationWhereInput) {
    return await this.prisma.reservation.findMany({
      where: params,
      include: { movieSchedule: true, user: true, seats: true },
    });
  }

  async findById(id: string) {
    return await this.prisma.reservation.findUnique({
      where: { id },
      include: { movieSchedule: true, user: true, seats: true },
    });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const { personAmt, movieScheduleId, seats } = updateReservationDto;
    return await this.prisma.reservation.update({
      where: { id },
      include: { movieSchedule: true, user: true, seats: true },
      data: {
        movieScheduleId,
        personAmt,
        seats: {
          connect: seats.map((id) => ({ id })),
        },
      },
    });
  }

  async deleteById(id: string) {
    return await this.prisma.reservation.delete({
      where: { id },
      include: { movieSchedule: true, user: true, seats: true },
    });
  }
}
