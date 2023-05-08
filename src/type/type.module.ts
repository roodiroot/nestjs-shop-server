import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Type } from './model/type.model';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';

@Module({
  controllers: [TypeController],
  providers: [TypeService],
  imports: [SequelizeModule.forFeature([Type])],
})
export class TypeModule {}
