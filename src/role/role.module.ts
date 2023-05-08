import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './model/role.model';

@Module({
  providers: [RoleService],
  controllers: [RoleController],
  imports: [SequelizeModule.forFeature([Role])],
  exports: [RoleService],
})
export class RoleModule {}
