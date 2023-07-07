import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BaseResponse } from 'src/types/response/base-response.dto';
import { GetAllMoviesResponse } from 'src/types/response/movies/get-all-movies.dto';
import { GetMovieResponse } from 'src/types/response/movies/get-movie.dto';
import { IsAdminGuard } from 'src/users/guards/isAdmin.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';

@ApiTags('Moives')
@Controller('movies')
export class MoviesController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private moviesService: MoviesService,
  ) {}

  @Get()
  @ApiQuery({ type: FilterDto })
  @ApiOperation({ summary: '모든 영화 정보 가져오기 with Filter' })
  @ApiOkResponse({ type: GetAllMoviesResponse })
  async findAll(@Query() dto?: FilterDto): Promise<GetAllMoviesResponse> {
    const movies = await this.moviesService.findAll(dto);
    return {
      ok: true,
      msg: '모든 영화 정보',
      status: 200,
      data: movies,
    };
  }

  @UseGuards(IsAdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '어드민 - 영화 생성' })
  @ApiCreatedResponse({ type: GetMovieResponse })
  async create(@Body() dto: CreateMovieDto): Promise<GetMovieResponse> {
    const movie = await this.moviesService.create(dto);
    this.logger.log(`${movie.title}(${movie.id}) - 영화 생성`);
    return {
      ok: true,
      msg: `${movie.title}(${movie.id}) - 영화 생성`,
      status: 201,
      data: movie,
    };
  }

  @Get(':movieId')
  @ApiOperation({ summary: '영화 정보 가져오기' })
  @ApiOkResponse({ type: GetMovieResponse })
  async findOne(@Param('movieId') movieId: string): Promise<GetMovieResponse> {
    const movie = await this.moviesService.findOne(movieId);
    return {
      ok: true,
      msg: `${movie.title}(${movie.id}) - 영화 정보`,
      status: 200,
      data: movie,
    };
  }

  @UseGuards(IsAdminGuard)
  @Patch(':movieId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '어드민 - 영화 정보 업데이트' })
  @ApiCreatedResponse({ type: GetMovieResponse })
  async update(
    @Param('movieId') movieId: string,
    @Body() dto: UpdateMovieDto,
  ): Promise<GetMovieResponse> {
    const movie = await this.moviesService.update(movieId, dto);
    return {
      ok: true,
      msg: `${movie.title}(${movie.id}) - 영화 정보 업데이트`,
      status: 201,
      data: movie,
    };
  }

  @UseGuards(IsAdminGuard)
  @ApiBearerAuth()
  @Delete(':movieId')
  @ApiOperation({ summary: '어드민 - 영화 정보 삭제' })
  @ApiCreatedResponse({ type: BaseResponse })
  async remove(@Param('movieId') movieId: string): Promise<BaseResponse> {
    const movie = await this.moviesService.remove(movieId);
    this.logger.log(`${movie.title}(${movie.id}) - 영화 삭제`);
    return {
      ok: true,
      msg: `${movie.title}(${movie.id}) - 영화 삭제`,
      status: 201,
    };
  }
}
