import { ApiProperty } from '@nestjs/swagger';
import { SeatEntity } from 'src/seats/entities/seat.entity';
import { BaseResponse } from '../base-response.dto';

export class GetAllSeatsResponse extends BaseResponse {
  @ApiProperty({
    description: '모든 좌석 정보 가져오기',
    type: SeatEntity,
    isArray: true,
  })
  data: SeatEntity[];
}
