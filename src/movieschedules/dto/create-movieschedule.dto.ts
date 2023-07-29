import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

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
    description: '상영 시간',
  })
  @Transform((x) => new Date(x.value))
  @IsDate()
  startTm: Date;

  @ApiProperty({
    description: '종료 시간',
  })
  @Transform((x) => new Date(x.value))
  @IsDate()
  endTm: Date;
}
