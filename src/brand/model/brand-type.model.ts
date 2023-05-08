import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Type } from 'src/type/model/type.model';
import { Brand } from './brand.model';

@Table({ tableName: 'brand_type', createdAt: false, updatedAt: false })
export class BrandType extends Model<BrandType> {
  @ForeignKey(() => Brand)
  @Column
  brandId: number;

  @ForeignKey(() => Type)
  @Column
  typeId: number;
}
