import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@naver.com',
    description: '이메일 로그인 시 사용할 이메일',
  })
  @IsEmail()
  @MinLength(4)
  @MaxLength(40)
  email: string;

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
    example: '01000000000',
    description: '전화번호',
  })
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({
    example: '000000',
    description: '비밀번호(4~20), 영어와 숫자만 사용 가능.',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  password: string;
}
