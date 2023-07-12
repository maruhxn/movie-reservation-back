import { ApiProperty } from '@nestjs/swagger';
import { MoviescheduleEntity } from 'src/movieschedules/entities/movieschedule.entity';
import { BaseResponse } from '../base-response.dto';

export class GetAllMovieScheduleResponse extends BaseResponse {
  @ApiProperty({
    description: '모든 영화 스케쥴 정보 가져오기',
    type: MoviescheduleEntity,
    isArray: true,
  })
  data: MoviescheduleEntity[];
}
