import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateRoleDto) {
    return await this.roleService.create(dto);
  }
}
