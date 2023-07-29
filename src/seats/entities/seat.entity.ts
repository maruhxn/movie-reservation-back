import { ApiProperty } from '@nestjs/swagger';
import { Seat } from '@prisma/client';
import { ScreenEntity } from 'src/screen/entities/screen.entity';

export class SeatEntity implements Seat {
  constructor({ screen, ...data }: Partial<SeatEntity>) {
    Object.assign(this, data);

    if (screen) this.screen = new ScreenEntity(screen);
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
    required: false,
    nullable: true,
    description: '상영관 아이디',
  })
  screenId: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '상영관 정보',
    type: () => ScreenEntity,
  })
  screen?: ScreenEntity;
}
