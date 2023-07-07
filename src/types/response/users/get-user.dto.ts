import { ApiProperty } from '@nestjs/swagger';
import { UserInfo } from 'src/types/user-info';
import { BaseResponse } from '../base-response.dto';

export class GetUserResponse extends BaseResponse {
  @ApiProperty({ description: '유저 정보', type: UserInfo })
  data: UserInfo;
}
