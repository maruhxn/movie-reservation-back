import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {
  @ApiProperty({
    description: '유저 아이디',
  })
  readonly userId: string;

  @ApiProperty({
    description: '유저 이름',
  })
  readonly name: string;

  @ApiProperty({
    description: '유저 이메일',
  })
  readonly email: string;
}
