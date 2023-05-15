import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
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
import { RoleModule } from './role/role.module';
import { Role } from './role/model/role.model';
import { UserRole } from './user/model/user_role.model';
import { BrandType } from './brand/model/brand-type.model';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MessgeModule } from './messge/messge.module';
import * as path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASSWORD,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
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
    }),
    ProductsModule,
    BrandModule,
    TypeModule,
    DescriptionModule,
    UserModule,
    RoleModule,
    FilesModule,
    MessgeModule,
    TelegrafModule,
  ],
})
export class AppModule {}
