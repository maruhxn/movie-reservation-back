import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { BaseResponse } from '../base-response.dto';

export class GetUserResponse extends BaseResponse {
  @ApiProperty({ description: '유저 정보', type: UserEntity })
  data: UserEntity;
}
