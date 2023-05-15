import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Type } from './model/type.model';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TypeController],
  providers: [TypeService, JwtService],
  imports: [SequelizeModule.forFeature([Type])],
})
export class TypeModule {}
