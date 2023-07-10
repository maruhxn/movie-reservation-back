import { Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { SeatsRepository } from './repository/seats.repository';

@Injectable()
export class SeatsService {
  constructor(private seatsRepository: SeatsRepository) {}

  async create(createSeatDto: CreateSeatDto) {
    return await this.seatsRepository.create({ data: createSeatDto });
  }

  async createMany(createSeatDtos: CreateSeatDto[]) {
    return await this.seatsRepository.createMany({ data: createSeatDtos });
  }

  async findAll() {
    return await this.seatsRepository.findMany();
  }

  async findUnique(id: string) {
    return await this.seatsRepository.findUnique({ where: { id } });
  }

  async update(id: string, updateSeatDto: UpdateSeatDto) {
    return await this.seatsRepository.update({
      where: { id },
      data: updateSeatDto,
    });
  }

  async remove(id: string) {
    return await this.seatsRepository.delete({
      where: { id },
    });
  }
}
