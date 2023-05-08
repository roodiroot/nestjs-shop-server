import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  createRole(@Body() roleDto: CreateRoleDto) {
    return this.roleService.create(roleDto);
  }

  @Get()
  getAllRoles() {
    return this.roleService.getAll();
  }
}
