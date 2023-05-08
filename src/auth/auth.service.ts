import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/model/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  // АВТОРИЗАЦИЯ ПОЛЬЗОАВАТЕЛЯ
  async signIn(email: string, pass: string): Promise<any> {
    // ПОЛУЧАЕМ ЮЗЕРА ПО EMAIL
    const user = await this.usersService.getOneUser(email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Такого логина не существует',
      });
    }
    // ПРОВЕРЯЕМ ХЕШИРОВАННЫЕ ПАРОЛИ
    const passwordTrue = await bcrypt.compare(pass, user?.password);
    // ЕСЛИ ОНИ НЕ СОВПАДАЮТ , БРОСАЕМ ОШИБКУ
    if (!passwordTrue) {
      throw new UnauthorizedException({
        message: 'Не верный пароль',
      });
    }
    // ЕСЛИ СОВПАДАЮТ, ТО ИЗ ВСЕГО КРОМЕ ПАРОЛЯ ГЕНЕРИРУЕМ GWT ТОКЕН
    const { password, ...result } = user;

    return this.generateToken(user);
  }

  // РЕГЕСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
  async registration(userDto: CreateUserDto) {
    // ОБРАЩАЕМСЯ К USER_SERVICE ДЛЯ ТОГО ЧТО БЫ ПОСМОТРЕТЬ ЕСТЬ ЛИ ТАКОЙ ЮЗЕР УЖЕ ЗАРЕГЕСТРИРРОВАННЫЫЙ В БАЗЕ
    const candidate = await this.usersService.getOneUser(userDto.email);
    if (candidate) {
      throw new HttpException(
        'Такой пользователь уже зарегестрирован',
        HttpStatus.BAD_REQUEST,
      );
    }
    // ЕСЛИ ЮЗЕРА НЕТ ХЕШИРУЕМ ПАРОЛЬ
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    //И СОЗДАЕМ НОВОГО ЮЗЕРА
    const user = await this.usersService.create({
      ...userDto,
      password: hashPassword,
    });
    // ГЕНЕРИРУЕМ GWT ТОКЕН
    return this.generateToken(user);
  }

  // ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ GWT ТОКЕНА
  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, role: user.roles };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
