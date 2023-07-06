import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseResponse {
  @ApiProperty({ example: true, description: '성공 여부' })
  ok: boolean;

  @ApiProperty({ example: '성공', description: '메시지' })
  msg: string;

  @ApiProperty({ example: 200, description: 'Http Status Code' })
  status: number;
}
