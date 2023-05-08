import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleService } from 'src/role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    private roleService: RoleService,
  ) {}

  async create(userDto: CreateUserDto) {
    const user = await this.userRepository.create(userDto);
    const role = await this.roleService.getRoleByName('ADMIN');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });

    return users;
  }

  async getOneUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      include: { all: true },
    });
    return user;
  }
}
