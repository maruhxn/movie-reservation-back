import { ApiProperty } from '@nestjs/swagger';
import { Token } from '@prisma/client';

export class TokenEntity implements Token {
  @ApiProperty({
    description: '토큰 고유 아이디',
  })
  id: string;
  @ApiProperty({
    description: '이메일 인증 시 사용될 random token(string)',
  })
  payload: string;
  @ApiProperty({
    description: '토큰 생성 시각',
  })
  createdAt: Date;
  @ApiProperty({
    description: '토큰을 발급받은 사용자의 id',
  })
  userId: string;
}
