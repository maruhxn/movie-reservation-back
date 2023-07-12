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
    const screen = await this.screenRepository.create(createScreenDto);

    const seatsList = this.generateNumberSequence(screen.seatAmt, screen.id);

    await this.seatsService.createMany(seatsList);

    return screen;
  }

  private generateNumberSequence(
    seatAmt: number,
    screenId: string,
    startNumber = 0,
  ) {
    const seatsList: CreateSeatDto[] = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let count = startNumber;

    for (let i = startNumber; i < seatAmt; i++) {
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
    return await this.screenRepository.findAll();
  }

  async findById(id: string) {
    return await this.screenRepository.findById(id);
  }

  async update(id: string, updateScreenDto: UpdateScreenDto) {
    const screen = await this.findById(id);
    const difference = updateScreenDto.seatAmt - screen.seats.length;
    if (difference < 0) {
      // seatAmt 양이 원래보다 줄어들면, 좌석을 이름 역순으로 삭제
      const seatIds = await this.seatsService.findManyWithNames(difference);
      await this.seatsService.deleteManyById(seatIds);
    } else if (difference > 0) {
      // seatAmt 양이 원래보다 늘어나면, 좌석을 이어서 추가
      const seatsList = this.generateNumberSequence(
        updateScreenDto.seatAmt,
        screen.id,
        screen.seats.length,
      );
      await this.seatsService.createMany(seatsList);
    }
    return await this.screenRepository.update(id, updateScreenDto);
  }

  async deleteById(id: string) {
    return await this.screenRepository.deleteById(id);
  }
}
