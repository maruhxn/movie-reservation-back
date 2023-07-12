import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMoviescheduleDto {
  @ApiProperty({ description: '영화 아이디' })
  @IsString()
  movieId: string;

  @ApiProperty({
    description: '상영관 아이디',
  })
  @IsString()
  screenId: string;

  @ApiProperty({
    description: '상영일',
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: '상영 시간',
  })
  @IsString()
  startTm: string;

  @ApiProperty({
    description: '종료 시간',
  })
  @IsString()
  endTm: string;
}
