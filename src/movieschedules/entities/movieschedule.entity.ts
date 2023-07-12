import { ApiProperty } from '@nestjs/swagger';
import { MovieSchedule } from '@prisma/client';
import { MovieEntity } from 'src/movie/entities/movies.entity';
import { ScreenEntity } from 'src/screen/entities/screen.entity';

export class MoviescheduleEntity implements MovieSchedule {
  constructor({ movie, screen, ...data }: Partial<MoviescheduleEntity>) {
    Object.assign(this, data);

    if (movie) this.movie = new MovieEntity(movie);
    if (screen) this.screen = new ScreenEntity(screen);
  }

  @ApiProperty({
    description: '고유 아이디',
  })
  id: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '영화 아이디',
  })
  movieId: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '영화 정보',
  })
  movie?: MovieEntity;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '상영관 아이디',
  })
  screenId: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '상영관 정보',
  })
  screen?: ScreenEntity;

  @ApiProperty({
    description: '상영일',
  })
  startDate: string;

  @ApiProperty({
    description: '상영 시간',
  })
  startTm: string;

  @ApiProperty({
    description: '종료 시간',
  })
  endTm: string;
}