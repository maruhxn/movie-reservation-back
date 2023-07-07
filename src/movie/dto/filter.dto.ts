import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum ConditionEnum {
  POPULARITY = 'popularity',
  TITLE = 'title',
  RELEASE_DATE = 'release_date',
  VOTE_AVERAGE = 'vote_average',
}

export enum SortEnum {
  DESC = 'desc',
  ASC = 'asc',
}

export class FilterDto {
  @ApiProperty({
    description: '정렬 조건',
  })
  @IsEnum(ConditionEnum)
  condition: 'popularity' | 'title' | 'release_date' | 'vote_average' =
    'popularity';

  @ApiProperty({
    description: '내림차순 혹은 오름차순',
  })
  @IsEnum(SortEnum)
  sort: 'desc' | 'asc' = 'desc';
}
