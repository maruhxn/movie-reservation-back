import {
  Body,
  Controller,
  Delete,
  Get,
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
import { BaseResponse } from 'src/types/response/base-response.dto';
import { GetAllMovieScheduleResponse } from 'src/types/response/movieschedules/get-all-movieschedules.dto';
import { GetMovieScheduleResponse } from 'src/types/response/movieschedules/get-movieschedule.dto';
import { IsAdminGuard } from 'src/users/guards/isAdmin.guard';
import { CreateMoviescheduleDto } from './dto/create-movieschedule.dto';
import { UpdateMoviescheduleDto } from './dto/update-movieschedule.dto';
import { MoviescheduleEntity } from './entities/movieschedule.entity';
import { MovieschedulesService } from './movieschedules.service';

@ApiTags('Movie Shcedules')
@Controller('movieschedules')
export class MovieschedulesController {
  constructor(private readonly movieschedulesService: MovieschedulesService) {}

  @UseGuards(IsAdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '어드민 - 영화 스케쥴 생성' })
  @ApiCreatedResponse({ type: GetMovieScheduleResponse })
  async create(@Body() dto: CreateMoviescheduleDto) {
    console.log(dto);
    const movieSchedule = new MoviescheduleEntity(
      await this.movieschedulesService.create(dto),
    );
    return {
      ok: true,
      msg: `${movieSchedule.movie.title}(${movieSchedule.movieId}) - 영화 스케쥴 생성(${movieSchedule.id})`,
      status: 201,
      data: movieSchedule,
    };
  }

  @Get()
  @ApiQuery({ example: { startDate: '2023-01-01' } })
  @ApiOperation({ summary: '해당일의 모든 영화 스케쥴 정보 가져오기' })
  @ApiOkResponse({ type: GetAllMovieScheduleResponse })
  async findAllByDate(@Query('startDate') startDate: string) {
    const movieSchedules = await this.movieschedulesService.findAllByDate(
      startDate,
    );

    const results = movieSchedules.map(
      (movieSchedule) => new MoviescheduleEntity(movieSchedule),
    );
    return {
      ok: true,
      msg: '모든 영화 스케쥴 정보',
      status: 200,
      data: results,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '영화 스케쥴 정보 조회' })
  @ApiOkResponse({ type: GetMovieScheduleResponse })
  async findById(@Param('id') id: string) {
    const movieSchedule = new MoviescheduleEntity(
      await this.movieschedulesService.findById(id),
    );
    return {
      ok: true,
      msg: `${movieSchedule.movie.title}(${movieSchedule.movieId}) - 영화 스케쥴 조회(${movieSchedule.id})`,
      status: 201,
      data: movieSchedule,
    };
  }

  @UseGuards(IsAdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '어드민 - 영화 스케쥴 정보 업데이트' })
  @ApiCreatedResponse({ type: GetMovieScheduleResponse })
  async update(
    @Param('id') id: string,
    @Body() updateMoviescheduleDto: UpdateMoviescheduleDto,
  ) {
    const movieSchedule = new MoviescheduleEntity(
      await this.movieschedulesService.update(id, updateMoviescheduleDto),
    );
    return {
      ok: true,
      msg: `${movieSchedule.movie.title}(${movieSchedule.movieId}) - 영화 스케쥴 업데이트(${movieSchedule.id})`,
      status: 201,
      data: movieSchedule,
    };
  }

  @UseGuards(IsAdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @Delete(':movieId')
  @ApiOperation({ summary: '어드민 - 영화 스케쥴 정보 삭제' })
  @ApiCreatedResponse({ type: BaseResponse })
  async deleteById(@Param('id') id: string) {
    const movieSchedule = new MoviescheduleEntity(
      await this.movieschedulesService.deleteById(id),
    );
    return {
      ok: true,
      msg: `${movieSchedule.movie.title}(${movieSchedule.movieId}) - 영화 스케쥴 삭제(${movieSchedule.id})`,
      status: 201,
    };
  }
}
