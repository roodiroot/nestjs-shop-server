import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Products } from './models/products.model';
import { FilesModule } from 'src/files/files.module';
import { DescriptionModule } from 'src/description/description.module';
import { Description } from 'src/description/model/description.model';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [
    SequelizeModule.forFeature([Products, Description]),
    FilesModule,
    DescriptionModule,
  ],
})
export class ProductsModule {}
