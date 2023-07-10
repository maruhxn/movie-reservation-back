import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';

export class CreateScreenDto {
  @ApiProperty({
    description: '상영관 번호',
  })
  @Min(1)
  @Max(10)
  screenNum: number;

  @ApiProperty({
    description: '총 좌석 수',
  })
  @Max(260)
  @Min(1)
  seatAmt: number;
}
