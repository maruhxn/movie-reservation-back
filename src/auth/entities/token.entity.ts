import { ApiProperty } from '@nestjs/swagger';
import { Token } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

export class TokenEntity implements Token {
  constructor({ user, ...data }: Partial<TokenEntity>) {
    Object.assign(this, data);

    if (user) this.user = new UserEntity(user);
  }

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
    nullable: true,
    required: false,
    description: '토큰을 발급받은 사용자의 id',
  })
  userId: string | null;

  @ApiProperty({
    nullable: true,
    required: false,
    description: '토큰을 발급받은 사용자 정보',
  })
  user?: UserEntity;
}
