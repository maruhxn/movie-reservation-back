import { ApiProperty } from '@nestjs/swagger';
import { ReservationEntity } from 'src/reservations/entities/reservation.entity';
import { BaseResponse } from '../base-response.dto';

export class GetReservationResponse extends BaseResponse {
  @ApiProperty({ description: '예매 정보', type: ReservationEntity })
  data: ReservationEntity;
}
