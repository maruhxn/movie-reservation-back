import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { format, sub } from 'date-fns';
import * as fs from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as path from 'path';
import { catchError, firstValueFrom, map } from 'rxjs';
import movieConfig from 'src/config/movie.config';
import { logDir } from 'src/logger/logger.module';
import { CreateMovieDto } from 'src/movie/dto/create-movie.dto';
import { MoviesService } from '../movie/movies.service';

interface ICollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

interface IGenre {
  id: number;
  name: string;
}

interface IMovieDetail {
  genres: IGenre[];
  belongs_to_collection: ICollection;
  runtime: number;
}

interface IMovieNowPlaying {
  adult: boolean;
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

@Injectable()
export class BatchService {
  private MOVIE_API_BASE_URL: string;
  private MOVIE_API_KEY: string;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(movieConfig.KEY) private config: ConfigType<typeof movieConfig>,
    private readonly httpService: HttpService,
    private readonly moviesService: MoviesService,
  ) {
    this.MOVIE_API_BASE_URL = 'https://api.themoviedb.org/3';
    this.MOVIE_API_KEY = config.movieApi;
  }

  async getMovieDetail(movieId: number): Promise<IMovieDetail> {
    const movieDetailUrl = `${this.MOVIE_API_BASE_URL}/movie/${movieId}?language=ko-KR&api_key=${this.MOVIE_API_KEY}`;
    const movieDetail: IMovieDetail = await firstValueFrom(
      this.httpService
        .get(movieDetailUrl)
        .pipe(map((res) => res.data))
        .pipe(
          catchError(() => {
            throw new ForbiddenException('API not available');
          }),
        ),
    );

    return movieDetail;
  }

  // @Cron('0 0 0 * * 1', { name: 'Update Weekly Boxoffice' })
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async getMovies() {
    // let showRange: IShowRange;
    const startDate = sub(new Date(), {
      months: 1,
    });
    const startDateStr = format(startDate, 'yyyy-MM-dd');
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    this.logger.log(`${todayStr} | 영화 정보 업데이트 시작.`);
    const data = [] as IMovieNowPlaying[];
    for (let page = 1; page <= 2; page++) {
      const url = `${this.MOVIE_API_BASE_URL}/discover/movie?certification_country=KR&include_adult=false&include_video=false&language=ko-KR&page=${page}&region=KR&release_date.gte=${startDateStr}&release_date.lte=${todayStr}&sort_by=popularity.desc&watch_region=KR&with_release_type=3&with_runtime.gte=0&with_runtime.lte=400&api_key=${this.MOVIE_API_KEY}`;
      const eachPageData = await firstValueFrom(
        this.httpService
          .get(url)
          .pipe(map((res) => res.data?.results))
          .pipe(
            catchError(() => {
              throw new ForbiddenException('API not available');
            }),
          ),
      );
      data.push(...eachPageData);
    }

    const movieDetails: IMovieDetail[] = await Promise.all(
      data.map(async (movie) => {
        const detail = await this.getMovieDetail(movie.id);
        return detail;
      }),
    );

    const payload = data.map(
      (movie, idx) =>
        ({
          id: movie.id + '',
          title: movie.title,
          adult: movie.adult,
          backdrop_path: movie.backdrop_path,
          original_language: movie.original_language,
          original_title: movie.original_title,
          overview: movie.overview,
          popularity: movie.popularity,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          genres: movieDetails[idx].genres.map((genre) => genre.name),
          runtime: movieDetails[idx].runtime,
        } as CreateMovieDto),
    );

    await this.moviesService.refreshEveryday(payload, startDateStr);
    this.logger.log(`${todayStr} | 영화 정보 업데이트 완료.`);
    return data;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteLogs() {
    // 현재일로부터 1개월 전의 시간보다 더 오래된 로그들 삭제.
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    fs.readdir(logDir, (err, files) => {
      if (err) {
        console.error('Error reading logs directory:', err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(logDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('Error getting file stats:', err);
            return;
          }

          const fileModifiedDate = stats.mtime;
          const fileExtension = path.extname(file);

          if (fileExtension === '.log' && fileModifiedDate < oneMonthAgo) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting file:', err);
                return;
              }
            });
          }
        });
      });
    });
  }
}
