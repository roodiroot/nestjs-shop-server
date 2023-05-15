import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from './model/brand.model';
import { BrandType } from './model/brand-type.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [BrandService, JwtService],
  controllers: [BrandController],
  imports: [SequelizeModule.forFeature([Brand, BrandType])],
})
export class BrandModule {}
