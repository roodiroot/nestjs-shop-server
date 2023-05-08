import { IsString, Length, IsNumber } from 'class-validator';
export class CreateBrandDto {
  @IsString({ message: 'должно быть строкой' })
  @Length(1, 50, { message: 'должно быть от 1 до 50 символов' })
  name: string;
  @IsString({ message: 'должно быть строкой' })
  @Length(1, 50, { message: 'должно быть от 1 до 50 символов' })
  brandСountry: string;
}
