import { ApiProperty } from '@nestjs/swagger';
import { UserInfo } from 'src/auth/user-info';
import { BaseResponse } from '../base-response.dto';

export class GetUserInfoResponse extends BaseResponse {
  @ApiProperty({ description: '유저 정보', type: UserInfo })
  data: UserInfo;
}
