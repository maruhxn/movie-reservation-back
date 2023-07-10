import { ApiProperty } from '@nestjs/swagger';
import { ScreenEntity } from 'src/screen/entities/screen.entity';
import { BaseResponse } from '../base-response.dto';

export class GetScreenResponse extends BaseResponse {
  @ApiProperty({ description: '상영관 정보', type: ScreenEntity })
  data: ScreenEntity;
}
