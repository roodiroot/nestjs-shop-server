import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from './model/brand.model';
import { BrandType } from './model/brand-type.model';

@Module({
  providers: [BrandService],
  controllers: [BrandController],
  imports: [SequelizeModule.forFeature([Brand, BrandType])],
})
export class BrandModule {}
