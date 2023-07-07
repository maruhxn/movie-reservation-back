import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: '고유 아이디',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: '제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '관람등급(성인 or 성인X)',
  })
  @IsBoolean()
  @IsNotEmpty()
  adult: boolean;

  @ApiProperty({
    description: '배경이미지',
  })
  @IsString()
  backdrop_path?: string;

  @ApiProperty({
    description: '오리지널 언어',
  })
  @IsString()
  @IsNotEmpty()
  original_language: string;

  @ApiProperty({
    description: '오리지널 제목',
  })
  @IsString()
  @IsNotEmpty()
  original_title: string;

  @ApiProperty({
    description: '줄거리',
  })
  @IsString()
  @IsNotEmpty()
  overview: string;

  @ApiProperty({
    description: '인기도',
  })
  @IsNumber()
  @IsNotEmpty()
  popularity: number;

  @ApiProperty({
    description: '포스터 이미지',
  })
  @IsString()
  poster_path?: string;

  @ApiProperty({
    description: '개봉일자',
  })
  @IsString()
  @IsNotEmpty()
  release_date: string;

  @ApiProperty({
    description: '평점',
  })
  @IsNumber()
  @IsNotEmpty()
  vote_average: number;

  @ApiProperty({
    description: '평가 수',
  })
  @IsNumber()
  @IsNotEmpty()
  vote_count: number;

  @ApiProperty({
    description: '장르 배열',
  })
  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @ApiProperty({
    description: '런타임',
  })
  @IsNumber()
  @IsNotEmpty()
  runtime: number;
}
