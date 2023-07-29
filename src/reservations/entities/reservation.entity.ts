import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '@prisma/client';
import { MoviescheduleEntity } from 'src/movieschedules/entities/movieschedule.entity';
import { UserEntity } from './../../users/entities/user.entity';

export class ReservationEntity implements Reservation {
  constructor({ user, movieSchedule, ...data }: Partial<ReservationEntity>) {
    Object.assign(this, data);

    if (user) this.user = new UserEntity(user);
    if (movieSchedule)
      this.movieSchedule = new MoviescheduleEntity(movieSchedule);
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
    description: '예약한 유저 아이디',
  })
  userId: string;

  @ApiProperty({
    nullable: true,
    required: false,
    description: '예약한 유저 정보',
    type: () => UserEntity,
  })
  user?: UserEntity;

  @ApiProperty({
    description: '영화 스케쥴쥴 아이디',
  })
  movieScheduleId: string;

  @ApiProperty({
    nullable: true,
    required: false,
    description: '영화 스케쥴 정보',
    type: () => MoviescheduleEntity,
  })
  movieSchedule?: MoviescheduleEntity;

  @ApiProperty({
    isArray: true,
    description: '예약한 좌석 ID 배열',
    type: String,
  })
  seatIds: string[];

  @ApiProperty({
    isArray: true,
    description: '예약한 좌석 이름 배열',
    type: String,
  })
  seatNames: string[];

  @ApiProperty({
    description: '예약 생성 시각',
  })
  createdAt: Date;

  @ApiProperty({
    description: '예약 정보 수정 시각',
  })
  updatedAt: Date;
}
