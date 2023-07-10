import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeatsModule } from 'src/seats/seats.module';
import { ScreenRepository } from './repository/screen.repository';
import { ScreenController } from './screen.controller';
import { ScreenService } from './screen.service';

@Module({
  imports: [PrismaModule, SeatsModule],
  controllers: [ScreenController],
  providers: [ScreenService, ScreenRepository],
})
export class ScreenModule {}
