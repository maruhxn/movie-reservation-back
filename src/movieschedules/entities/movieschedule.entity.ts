import { ApiProperty } from '@nestjs/swagger';
import { MovieSchedule } from '@prisma/client';
import { MovieEntity } from 'src/movie/entities/movies.entity';
import { ReservationEntity } from 'src/reservations/entities/reservation.entity';
import { ScreenEntity } from 'src/screen/entities/screen.entity';

export class MoviescheduleEntity implements MovieSchedule {
  constructor({
    movie,
    screen,
    reservations,
    ...data
  }: Partial<MoviescheduleEntity>) {
    Object.assign(this, data);

    if (movie) this.movie = new MovieEntity(movie);
    if (screen) this.screen = new ScreenEntity(screen);
    if (reservations)
      this.reservations = reservations.map(
        (reservation) => new ReservationEntity(reservation),
      );
  }

  @ApiProperty({
    description: '고유 아이디',
  })
  id: string;

  @ApiProperty({
    description: '영화 아이디',
  })
  movieId: string;

  @ApiProperty({
    description: '상영관 아이디',
  })
  screenId: string;

  @ApiProperty({
    description: '상영 시간',
  })
  startTm: Date;

  @ApiProperty({
    description: '종료 시간',
  })
  endTm: Date;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '영화 정보',
    type: () => MovieEntity,
  })
  movie?: MovieEntity;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '상영관 정보',
    type: () => ScreenEntity,
  })
  screen?: ScreenEntity;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '예매 정보 배열',
    isArray: true,
    type: () => ReservationEntity,
  })
  reservations?: ReservationEntity[];
}
