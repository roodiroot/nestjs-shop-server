import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './model/role.model';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async create(roleDto: CreateRoleDto) {
    const role = await this.roleRepository.create({
      name: roleDto.name,
      description: roleDto.description,
    });
    return role;
  }

  async getRoleByName(name: string) {
    const role = await this.roleRepository.findOne({ where: { name } });
    return role;
  }

  async getAll() {
    const roles = await this.roleRepository.findAll();
    return roles;
  }
}
