import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDescriptonDto } from './dto/create-description.dto';
import { Description } from './model/description.model';

@Injectable()
export class DescriptionService {
  constructor(
    @InjectModel(Description) private descRepository: typeof Description,
  ) {}

  async create(descriptDto: CreateDescriptonDto) {
    const description = await this.descRepository.create(descriptDto);
    return description;
  }
  async destroy(id: number) {
    const description = await this.descRepository.destroy({ where: { id } });
    return description;
  }

  async getAll() {
    const desces = await this.descRepository.findAll({
      // include: { all: true },
    });
    return desces;
  }
}
