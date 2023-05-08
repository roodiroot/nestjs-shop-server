import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Products } from './products/models/products.model';
import { Brand } from './brand/model/brand.model';
import { ProductsModule } from './products/products.module';
import { BrandModule } from './brand/brand.module';
import { TypeModule } from './type/type.module';
import { Type } from './type/model/type.model';
import { DescriptionModule } from './description/description.module';
import { Description } from './description/model/description.model';
import { UserModule } from './user/user.module';
import { User } from './user/model/user.model';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { Role } from './role/model/role.model';
import { UserRole } from './user/model/user_role.model';
import { BrandType } from './brand/model/brand-type.model';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'OO9uny21',
      database: 'shop_db',
      models: [
        Products,
        Brand,
        Type,
        Description,
        User,
        Role,
        UserRole,
        BrandType,
      ],
      // autoLoadModels: true,
      // synchronize: true,
    }),
    ProductsModule,
    BrandModule,
    TypeModule,
    DescriptionModule,
    UserModule,
    AuthModule,
    RoleModule,
    FilesModule,
  ],
})
export class AppModule {}
