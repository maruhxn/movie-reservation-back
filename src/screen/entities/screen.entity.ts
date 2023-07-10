import { ApiProperty } from '@nestjs/swagger';
import { Screen } from '@prisma/client';

export class ScreenEntity implements Screen {
  constructor(partial: Partial<ScreenEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty({
    description: '고유 상영관 아이디',
  })
  id: string;

  @ApiProperty({
    description: '상영관 번호',
  })
  screenNum: number;

  @ApiProperty({
    description: '총 좌석 수',
  })
  seatAmt: number;
}
