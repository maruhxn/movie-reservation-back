import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MovieService } from './movie.service';

@Module({
  imports: [PrismaModule],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
