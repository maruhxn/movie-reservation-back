import { ApiProperty } from '@nestjs/swagger';
import { ProviderType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateKakaoUserDto {
  @ApiProperty({
    example: 'test@naver.com',
    description: '이메일 로그인 시 사용할 이메일',
  })
  @IsEmail()
  @MinLength(4)
  @MaxLength(40)
  email: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  @IsString()
  image: string;

  @ApiProperty({
    example: 'test',
    description:
      '유저 이름(1~15), 비밀번호에는 같은 유저 이름과 같은 문자열 포함 불가능.',
  })
  @Transform((params) => params.value.trim())
  //   @NotIn('password', {
  //     message: 'password는 name과 같은 문자열을 포함할 수 없습니다.',
  //   })
  @IsString()
  @MaxLength(15)
  name: string;

  @ApiProperty({
    description: '카카오 계정 아이디',
  })
  @IsString()
  snsId: string;

  @ApiProperty({
    description: '로그인 타입',
  })
  provider: ProviderType;
}
