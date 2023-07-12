import { ApiProperty } from '@nestjs/swagger';
import { MovieSchedule, Screen } from '@prisma/client';
import { MoviescheduleEntity } from 'src/movieschedules/entities/movieschedule.entity';
import { SeatEntity } from 'src/seats/entities/seat.entity';

export class ScreenEntity implements Screen {
  constructor({ seats, movieSchedules, ...data }: Partial<ScreenEntity>) {
    Object.assign(this, data);

    if (seats) this.seats = seats.map((seat) => new SeatEntity(seat));
    if (movieSchedules)
      this.movieSchedules = movieSchedules.map(
        (movieSchedule) => new MoviescheduleEntity(movieSchedule),
      );
  }
  @ApiProperty({
    description: '고유 상영관 아이디',
  })
  id: string;

  @ApiProperty({
    description: '상영관 번호',
  })
  screenNum: number;

  @ApiProperty({
    description: '총 좌석 수',
  })
  seatAmt: number;

  @ApiProperty({
    required: false,
    nullable: true,
    type: () => SeatEntity,
    isArray: true,
  })
  seats?: SeatEntity[];

  @ApiProperty({
    required: false,
    nullable: true,
    type: () => MoviescheduleEntity,
    isArray: true,
  })
  movieSchedules?: MovieSchedule[];
}
