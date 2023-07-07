import { ApiProperty } from '@nestjs/swagger';
import { UserInfo } from 'src/types/user-info';
import { BaseResponse } from '../base-response.dto';

export class GetAllUsersResponse extends BaseResponse {
  @ApiProperty({
    description: '모든 유저 정보 가져오기',
    type: UserInfo,
    isArray: true,
  })
  data: UserInfo[];
}
