import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: '예약 인원',
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  personAmt: number;

  @ApiProperty({
    description: '영화 스케쥴쥴 아이디',
  })
  @IsString()
  movieScheduleId: string;

  @ApiProperty({
    description: '예약할 좌석아이디 리스트',
  })
  @IsArray()
  @IsString({ each: true })
  seats: string[];
}
