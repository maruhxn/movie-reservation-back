import { Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { SeatsRepository } from './repository/seats.repository';

@Injectable()
export class SeatsService {
  constructor(private seatsRepository: SeatsRepository) {}

  async create(createSeatDto: CreateSeatDto) {
    return await this.seatsRepository.create(createSeatDto);
  }

  async createMany(createSeatDtos: CreateSeatDto[]) {
    return await this.seatsRepository.createMany(createSeatDtos);
  }

  async findAll() {
    return await this.seatsRepository.findAll();
  }

  async findById(id: string) {
    return await this.seatsRepository.findById(id);
  }

  async findManyWithNames(difference: number) {
    return await this.seatsRepository.findManyWithNames(difference);
  }

  async update(id: string, updateSeatDto: UpdateSeatDto) {
    return await this.seatsRepository.update(id, updateSeatDto);
  }

  async deleteById(id: string) {
    return await this.seatsRepository.deleteById(id);
  }

  async deleteManyById(seatIds: { id: string }[]) {
    const ids = seatIds.map((seat) => seat.id);
    return await this.seatsRepository.deleteManyById(ids);
  }
}
