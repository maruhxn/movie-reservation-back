import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '@prisma/client';

export class MovieEntity implements Movie {
  @ApiProperty({
    description: '고유 아이디',
  })
  id: string;

  @ApiProperty({
    description: '제목',
  })
  title: string;

  @ApiProperty({
    description: '관람등급(성인 or 성인X)',
  })
  adult: boolean;

  @ApiProperty({
    description: '배경이미지',
  })
  backdrop_path: string;

  @ApiProperty({
    description: '오리지널 언어',
  })
  original_language: string;

  @ApiProperty({
    description: '오리지널 제목',
  })
  original_title: string;

  @ApiProperty({
    description: '줄거리',
  })
  overview: string;

  @ApiProperty({
    description: '인기도',
  })
  popularity: number;

  @ApiProperty({
    description: '포스터 이미지',
  })
  poster_path: string;

  @ApiProperty({
    description: '개봉일자',
  })
  release_date: string;

  @ApiProperty({
    description: '평점',
  })
  vote_average: number;

  @ApiProperty({
    description: '평가 수',
  })
  vote_count: number;

  @ApiProperty({
    description: '장르 배열',
  })
  genres: string[];

  @ApiProperty({
    description: '런타임',
  })
  runtime: number;
}
