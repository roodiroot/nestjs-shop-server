import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt/dist';
import * as bcrypt from 'bcrypt';

import { User } from './model/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  async login(
    filter: { where: { email?: string; id?: number } },
    password: string,
  ) {
    const user = await this.findOne({ ...filter });

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Не верный пароль пользователя');
    }
    const jwt = await this.jwtService.signAsync({ id: user.id });
    return {
      jwt,
      user: { id: user.id, email: user.email, username: user.username },
    };
  }

  async create(dto: CreateUserDto) {
    const hashPassword = await bcrypt.hashSync(dto.password, 9);
    const user = await this.userRepository.create({
      email: dto.email,
      username: dto.username,
      password: hashPassword,
    });

    return { id: user.id, email: user.email, username: user.username };
  }

  async findOne(filter: { where: { email?: string; id?: number } }) {
    const user = await this.userRepository.findOne({ ...filter });
    if (!user) {
      throw new BadRequestException('Такого пользователя не существует');
    }
    return user;
  }
}
