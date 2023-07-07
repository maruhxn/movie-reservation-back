import { ApiProperty } from '@nestjs/swagger';
import { MovieEntity } from 'src/movie/entities/movies.entity';
import { BaseResponse } from '../base-response.dto';

export class GetAllMoviesResponse extends BaseResponse {
  @ApiProperty({
    description: '모든 영화 정보 가져오기',
    type: MovieEntity,
    isArray: true,
  })
  data: MovieEntity[];
}
