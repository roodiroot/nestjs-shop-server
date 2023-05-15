import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './model/role.model';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RoleService, JwtService],
  controllers: [RoleController],
  imports: [SequelizeModule.forFeature([Role]), UserModule],
  exports: [RoleService],
})
export class RoleModule {}
