import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTypeDto } from './dto/create-type.dto';
import { Type } from './model/type.model';

@Injectable()
export class TypeService {
  constructor(@InjectModel(Type) private typeRepository: typeof Type) {}

  async create(typeDto: CreateTypeDto) {
    const T = await this.getOneType({ typeName: typeDto.typeName });
    if (T) {
      throw new HttpException(
        'тип с таким названием уже существует',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      const type = await this.typeRepository.create(typeDto);
      return type;
    } catch (error) {
      throw new HttpException(
        'ошибка при создании типа',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAll() {
    const types = await this.typeRepository.findAll();
    return types;
  }

  async getOneType(params: { id?: number; typeName?: string }) {
    const brand = await this.typeRepository.findOne({ where: { ...params } });
    return brand;
  }
}
