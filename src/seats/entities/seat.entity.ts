import { ApiProperty } from '@nestjs/swagger';
import { Seat } from '@prisma/client';

export class SeatEntity implements Seat {
  constructor(partial: Partial<SeatEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty({
    description: '고유 좌석 아이디',
  })
  id: string;

  @ApiProperty({
    description: '좌석 이름',
  })
  name: string;

  @ApiProperty({
    description: '예매 아이디',
  })
  reservationId: string | null;

  @ApiProperty({
    description: '상영관 아이디',
  })
  screenId: string;
}
