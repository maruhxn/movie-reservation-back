import { Injectable } from '@nestjs/common';
import { CreateSeatDto } from 'src/seats/dto/create-seat.dto';
import { SeatsService } from 'src/seats/seats.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ScreenRepository } from './repository/screen.repository';

@Injectable()
export class ScreenService {
  constructor(
    private screenRepository: ScreenRepository,
    private seatsService: SeatsService,
  ) {}

  async create(createScreenDto: CreateScreenDto) {
    const screen = await this.screenRepository.create({
      data: createScreenDto,
    });

    const seatsList = this.generateNumberSequence(screen.seatAmt, screen.id);

    await this.seatsService.createMany(seatsList);

    return screen;
  }

  private generateNumberSequence(seatAmt, screenId) {
    const seatsList: CreateSeatDto[] = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let count = 0;

    for (let i = 0; i < seatAmt; i++) {
      const letterIndex = Math.floor(count / 10);
      const letter = alphabet[letterIndex];
      const number = count % 10;

      const seatItem: CreateSeatDto = {
        name: letter + number,
        screenId,
      };
      seatsList.push(seatItem);
      count++;
    }

    return seatsList;
  }

  async findAll() {
    return await this.screenRepository.findMany();
  }

  async findUnique(id: string) {
    return await this.screenRepository.findUnique({ where: { id } });
  }

  async update(id: string, updateScreenDto: UpdateScreenDto) {
    return await this.screenRepository.update({
      where: { id },
      data: updateScreenDto,
    });
  }

  async remove(id: string) {
    return await this.screenRepository.delete({
      where: { id },
    });
  }
}
