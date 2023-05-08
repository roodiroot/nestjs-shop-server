import { Module } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { DescriptionController } from './description.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Description } from './model/description.model';

@Module({
  providers: [DescriptionService],
  controllers: [DescriptionController],
  imports: [SequelizeModule.forFeature([Description])],
  exports: [DescriptionService],
})
export class DescriptionModule {}
