import { ApiProperty } from '@nestjs/swagger';
import { Seat } from '@prisma/client';
import { ReservationEntity } from 'src/reservations/entities/reservation.entity';
import { ScreenEntity } from 'src/screen/entities/screen.entity';

export class SeatEntity implements Seat {
  constructor({ screen, reservation, ...data }: Partial<SeatEntity>) {
    Object.assign(this, data);

    if (screen) this.screen = new ScreenEntity(screen);
    if (reservation) this.reservation = new ReservationEntity(reservation);
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
    description: '예매 아이디',
  })
  reservationId: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '예매 정보',
    type: () => ReservationEntity,
  })
  reservation?: ReservationEntity;

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
