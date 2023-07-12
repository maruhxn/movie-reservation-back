import { PartialType } from '@nestjs/swagger';
import { CreateMoviescheduleDto } from './create-movieschedule.dto';

export class UpdateMoviescheduleDto extends PartialType(CreateMoviescheduleDto) {}
