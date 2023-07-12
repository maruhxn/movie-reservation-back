import { ApiProperty } from '@nestjs/swagger';
import { MoviescheduleEntity } from 'src/movieschedules/entities/movieschedule.entity';
import { BaseResponse } from '../base-response.dto';

export class GetMovieScheduleResponse extends BaseResponse {
  @ApiProperty({ description: '영화 스케쥴 정보', type: MoviescheduleEntity })
  data: MoviescheduleEntity;
}
