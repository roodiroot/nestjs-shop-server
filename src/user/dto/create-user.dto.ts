import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'должно быть строкой' })
  @IsEmail({}, { message: 'не коректный email адрес' })
  email: string;

  @IsString({ message: 'должно быть строкой' })
  username: string;

  @IsString({ message: 'должно быть строкой' })
  @Length(4, 15, { message: 'пароль должен быть от 4 до 15 символов' })
  password: string;
}
