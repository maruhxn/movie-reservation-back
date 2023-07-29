import { Module } from '@nestjs/common';
import { MoviesModule } from 'src/movie/movies.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [MoviesModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
