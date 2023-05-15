import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './model/role.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private roleRepository: typeof Role,
  ) {}

  async create(dto: CreateRoleDto) {
    return await this.roleRepository.create(dto);
  }
}
