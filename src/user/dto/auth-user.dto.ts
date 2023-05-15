import { IsString, Length, IsEmail } from 'class-validator';

export class AuthUserDto {
  @IsString({ message: 'должно быть строкой' })
  email?: string;

  // @IsString({ message: 'должно быть строкой' })
  username?: string;

  @IsString({ message: 'должно быть строкой' })
  password?: string;
}
