import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { BaseResponse } from '../base-response.dto';

export class GetAllUsersResponse extends BaseResponse {
  @ApiProperty({
    description: '모든 유저 정보 가져오기',
    type: UserEntity,
    isArray: true,
  })
  data: UserEntity[];
}
