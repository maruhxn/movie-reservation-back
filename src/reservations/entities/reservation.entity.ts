import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '@prisma/client';
import { MoviescheduleEntity } from 'src/movieschedules/entities/movieschedule.entity';
import { SeatEntity } from 'src/seats/entities/seat.entity';
import { UserEntity } from './../../users/entities/user.entity';

export class ReservationEntity implements Reservation {
  constructor({
    user,
    movieSchedule,
    seats,
    ...data
  }: Partial<ReservationEntity>) {
    Object.assign(this, data);

    if (user) this.user = new UserEntity(user);
    if (movieSchedule)
      this.movieSchedule = new MoviescheduleEntity(movieSchedule);
    if (seats) this.seats = seats.map((seat) => new SeatEntity(seat));
  }

  @ApiProperty({
    description: '고유 아이디',
  })
  id: string;

  @ApiProperty({
    description: '예약 인원',
  })
  personAmt: number;

  @ApiProperty({
    nullable: true,
    required: false,
    description: '예약한 유저 아이디',
  })
  userId: string | null;

  @ApiProperty({
    nullable: true,
    required: false,
    description: '예약한 유저 정보',
    type: () => UserEntity,
  })
  user?: UserEntity;

  @ApiProperty({
    nullable: true,
    required: false,
    description: '영화 스케쥴쥴 아이디',
  })
  movieScheduleId: string | null;

  @ApiProperty({
    nullable: true,
    required: false,
    description: '영화 스케쥴 정보',
    type: () => MoviescheduleEntity,
  })
  movieSchedule?: MoviescheduleEntity;

  @ApiProperty({
    nullable: true,
    required: false,
    isArray: true,
    description: '예약한 좌석 정보 배열',
    type: () => SeatEntity,
  })
  seats?: SeatEntity[];

  @ApiProperty({
    description: '예약 생성 시각',
  })
  createdAt: Date;

  @ApiProperty({
    description: '예약 정보 수정 시각',
  })
  updatedAt: Date;
}
