import { ApiProperty } from '@nestjs/swagger';
import { ScreenEntity } from 'src/screen/entities/screen.entity';
import { BaseResponse } from '../base-response.dto';

export class GetAllScreensResponse extends BaseResponse {
  @ApiProperty({
    description: '모든 상영관 정보 가져오기',
    type: ScreenEntity,
    isArray: true,
  })
  data: ScreenEntity[];
}
