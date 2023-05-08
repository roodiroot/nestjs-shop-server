import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleModule } from 'src/role/role.module';
import { User } from './model/user.model';
import { UserRole } from './model/user_role.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    SequelizeModule.forFeature([User, UserRole]),
    RoleModule,
    // forwardRef(() => AuthModule),
    // AuthModule
  ],
  exports: [UserService],
})
export class UserModule {}
