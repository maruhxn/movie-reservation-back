import { BadRequestException, Injectable } from '@nestjs/common';
import { MoviesService } from './../movie/movies.service';

@Injectable()
export class SearchService {
  constructor(private readonly moviesService: MoviesService) {}

  async search(q: string) {
    if (!q) throw new BadRequestException('검색어를 입력해주세요');
    return await this.moviesService.findManyByQuery(q);
  }
}
