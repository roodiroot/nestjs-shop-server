import { IsString, Length } from 'class-validator';

export class MessageDto {
  @IsString({ message: 'должно быть строкой' })
  @Length(1, 500, { message: 'название должно быть от 1 до 100 символов' })
  message: string;
}
