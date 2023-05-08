import { IsString, Length, IsNumber } from 'class-validator';
import { Description } from 'src/description/model/description.model';

export class ProductDto {
  @IsString({ message: 'должно быть строкой' })
  @Length(0, 50, { message: 'название должно быть от 4 до 50 символов' })
  name: string;

  // @IsNumber({}, { message: 'цена должна быть числом' })
  price: number;

  // @IsNumber({}, { message: 'должно быть числом' })
  brandId: number;

  // @IsNumber({}, { message: 'должно быть числом' })
  typeId: number;

  descriptions: any;
}
export class UpdateDto {
  id: number;
  name: string;
  price: number;
}
