import { ApiProperty } from '@nestjs/swagger';
import { MovieEntity } from 'src/movie/entities/movies.entity';
import { BaseResponse } from '../base-response.dto';

export class GetMovieResponse extends BaseResponse {
  @ApiProperty({ description: '영화 정보 가져오기', type: MovieEntity })
  data: MovieEntity;
}
