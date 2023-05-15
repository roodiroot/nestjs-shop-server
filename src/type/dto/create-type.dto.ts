import { IsString, Length } from 'class-validator';

export class CreateTypeDto {
  @IsString({ message: 'должно быть строкой' })
  @Length(1, 50, { message: 'должно быть от 1 до 50 символов' })
  typeName: string;
}
