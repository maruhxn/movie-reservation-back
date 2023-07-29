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
    const { movieScheduleId, personAmt, seatIds, seatNames } =
      createReservationDto;
    const reservation = await this.prisma.reservation.create({
      data: {
        personAmt,
        movieScheduleId,
        userId,
        seatIds,
        seatNames,
      },
      include: {
        movieSchedule: true,
        user: true,
      },
    });
    return reservation;
  }

  async findAll(params?: Prisma.ReservationWhereInput) {
    return await this.prisma.reservation.findMany({
      where: params,
      include: { movieSchedule: true, user: true },
    });
  }

  async findById(id: string) {
    return await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        movieSchedule: {
          include: {
            screen: {
              select: {
                screenNum: true,
              },
            },
            movie: {
              select: {
                title: true,
                runtime: true,
              },
            },
          },
        },
        user: true,
      },
    });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const { personAmt, movieScheduleId, seatIds, seatNames } =
      updateReservationDto;
    return await this.prisma.reservation.update({
      where: { id },
      include: { movieSchedule: true, user: true },
      data: {
        movieScheduleId,
        personAmt,
        seatIds,
        seatNames,
      },
    });
  }

  async deleteById(id: string) {
    return await this.prisma.reservation.delete({
      where: { id },
      include: { movieSchedule: true, user: true },
    });
  }
}
