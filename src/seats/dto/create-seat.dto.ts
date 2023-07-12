import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty({
    description: '좌석 이름',
  })
  @Matches(/^[A-Z][0-9]$/, {
    message: '좌석은 단일 대문자와 단일 숫자로 이루어져야합니다.',
  })
  name: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '상영관 아이디',
  })
  screenId: string | null;
}
