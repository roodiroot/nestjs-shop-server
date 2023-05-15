import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Brand } from './model/brand.model';
import { DropDto } from './dto/drop-brand.dto';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand) private brandRepository: typeof Brand) {}

  async create(brandDto: CreateBrandDto) {
    const B = await this.getOneBrand({ name: brandDto.name });
    if (B) {
      throw new HttpException(
        'бренд с таким названием уже существует',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      const brand = await this.brandRepository.create(brandDto);
      return brand;
    } catch (error) {
      throw new HttpException(
        'ошибка при создании бренда',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async dropBrand(dto: DropDto) {
    //   const brand = await this.getOneBrand(dto.id);
    //   if (!brand) {
    //     throw new UnauthorizedException({
    //       message: 'Такоого бренда не существует',
    //     });
    //   }
    //   await this.brandRepository.destroy({ where: { id: dto.id } });
    //   const message = { message: `Бренд с id=${dto.id} успешно удален` };
    //   return message;
  }

  async getOneBrand(params: { id?: number; name?: string }) {
    const brand = await this.brandRepository.findOne({ where: { ...params } });
    return brand;
  }

  async getAll() {
    const brands = await this.brandRepository.findAll();
    return brands;
  }
}
