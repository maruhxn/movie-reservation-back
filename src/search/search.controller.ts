import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MovieEntity } from 'src/movie/entities/movies.entity';
import { GetAllMoviesResponse } from 'src/types/response/movies/get-all-movies.dto';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: '모든 예매 정보' })
  @ApiQuery({ name: 'q', type: String })
  @ApiOkResponse({ type: GetAllMoviesResponse })
  async searchMovies(@Query('q') q: string) {
    const searchedMovies = await this.searchService.search(q);
    const results = searchedMovies.map(
      (searchedMovie) => new MovieEntity(searchedMovie),
    );
    return {
      ok: true,
      msg: `검색된 영화 정보`,
      status: 200,
      data: results,
    };
  }
}
