import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Brand } from './model/brand.model';
import { DropDto } from './dto/drop-brand.dto';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand) private brandRepository: typeof Brand) {}

  async create(brandDto: CreateBrandDto) {
    const brand = await this.brandRepository.create(brandDto);
    return brand;
  }

  async dropBrand(dto: DropDto) {
    const brand = await this.getOneBrand(dto.id);
    if (!brand) {
      throw new UnauthorizedException({
        message: 'Такоого бренда не существует',
      });
    }
    await this.brandRepository.destroy({ where: { id: dto.id } });
    const message = { message: `Бренд с id=${dto.id} успешно удален` };
    return message;
  }

  async getOneBrand(id: number) {
    const brand = await this.brandRepository.findByPk(id);
    return brand;
  }

  async getAll() {
    const brands = await this.brandRepository.findAll();
    return brands;
  }
}
