import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../base-response.dto';

export class JWTResult {
  @ApiProperty({
    example: 'jwtaccesstoken',
    description: '인증 시 사용할 jwt 토큰',
  })
  accessToken: string;
}

export class LoginResponse extends BaseResponse {
  @ApiProperty({ description: 'JWT accessToken 발급', type: JWTResult })
  data: JWTResult;
}
