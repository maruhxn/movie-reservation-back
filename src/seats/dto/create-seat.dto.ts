import { ApiProperty } from '@nestjs/swagger';

export class CreateSeatDto {
  @ApiProperty({
    description: '좌석 이름',
  })
  name: string;

  @ApiProperty({
    description: '상영관 아이디',
  })
  screenId: string;
}
