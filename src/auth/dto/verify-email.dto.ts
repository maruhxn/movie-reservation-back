import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: 'signupVerifyToken',
    description: '이메일 인증 시 사용되는 token.',
  })
  @IsString()
  signupVerifyToken: string;
}
