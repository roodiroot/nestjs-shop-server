import { Body, Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { DropDto } from './dto/drop-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() brandDto: CreateBrandDto) {
    return this.brandService.create(brandDto);
  }

  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Delete()
  dropBrand(@Body() dto: DropDto) {
    return this.brandService.dropBrand(dto);
  }

  @Get()
  getAll() {
    return this.brandService.getAll();
  }
}
