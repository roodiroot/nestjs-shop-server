import { Body, Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { DropDto } from './dto/drop-brand.dto';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';

@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  // ====================== СОЗДАНИЕ БРЕНДА ====================
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() brandDto: CreateBrandDto) {
    return this.brandService.create(brandDto);
  }

  // ====================== УДАЛЕНИЕ БРЕНДА ====================
  @UseGuards(JwtAuthGuard)
  @Delete()
  dropBrand(@Body() dto: DropDto) {
    return this.brandService.dropBrand(dto);
  }

  // ====================== ВЫВОД СПИСКА БРЕНДОВ ===============
  @Get()
  getAll() {
    return this.brandService.getAll();
  }
}
