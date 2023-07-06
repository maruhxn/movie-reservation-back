import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private prisma: PrismaService,
  ) {}

  async refreshEveryday(
    createMovieDto: CreateMovieDto[],
    startDateStr: string,
  ) {
    // release-date가 startDate보다 작은 경우, movie 삭제
    const deleted = await this.prisma.movie.deleteMany({
      where: {
        release_date: {
          lt: startDateStr,
        },
      },
    });
    this.logger.log('Out Dated', deleted.count);

    // 이미 movieId에 해당하는 movie가 존재한다면 create X, 없다면 create

    createMovieDto.map(async (movieDto) => {
      await this.prisma.movie.upsert({
        where: {
          id: movieDto.id,
        },
        update: movieDto,
        create: movieDto,
      });
    });

    this.logger.log('영화 정보 업데이트 성공', new Date().toISOString());
  }

  createMany(createMovieDtos: CreateMovieDto[]) {
    this.logger.log('MovieInfo Update!');
    return this.prisma.movie.createMany({
      data: createMovieDtos,
    });
  }

  create(createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: createMovieDto,
    });
  }
}
