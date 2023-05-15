import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { UserRole } from './model/user_role.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  providers: [UserService, JwtAuthGuard],
  controllers: [UserController],
  imports: [
    SequelizeModule.forFeature([User, UserRole]),
    JwtModule.register({
      secret: 'sdsfggdfghh56h5des',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  exports: [UserService, JwtAuthGuard],
})
export class UserModule {}
