import { ApiProperty } from '@nestjs/swagger';
import { ReservationEntity } from 'src/reservations/entities/reservation.entity';
import { BaseResponse } from '../base-response.dto';

export class GetAllReservationsResponse extends BaseResponse {
  @ApiProperty({
    description: '모든 예매 정보 가져오기',
    type: ReservationEntity,
    isArray: true,
  })
  data: ReservationEntity[];
}
