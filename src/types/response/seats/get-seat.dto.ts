import { ApiProperty } from '@nestjs/swagger';
import { SeatEntity } from 'src/seats/entities/seat.entity';
import { BaseResponse } from '../base-response.dto';

export class GetSeatResponse extends BaseResponse {
  @ApiProperty({ description: '좌석 정보', type: SeatEntity })
  data: SeatEntity;
}
