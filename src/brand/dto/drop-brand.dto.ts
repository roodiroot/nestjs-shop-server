import { IsNumber } from 'class-validator';

export class DropDto {
  @IsNumber({}, { message: 'должно быть числом' })
  id: number;
}
