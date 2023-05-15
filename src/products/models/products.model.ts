import {
  Model,
  Column,
  Table,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Brand } from 'src/brand/model/brand.model';
import { Description } from 'src/description/model/description.model';
import { Type } from 'src/type/model/type.model';

interface ProductCreationAtrr {
  name: string;
  brandId: number;
  price: number;
  logo: string;
  imges: [string];
  descriptions: [Description] | [];
  numberOfViews: number;
  hit: boolean;
}

@Table({ tableName: 'products', updatedAt: false, createdAt: false })
export class Products extends Model<Products, ProductCreationAtrr> {
  @Column({ type: DataType.STRING, unique: true })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  vendorcode: string;

  @ForeignKey(() => Brand)
  brandId: number;

  @ForeignKey(() => Type)
  typeId: number;

  @Column
  price: number;

  @Column
  logo: string;

  @Column({ defaultValue: 0 })
  numberOfViews: number;

  @Column
  hit: boolean;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  imges: [string];

  @HasMany(() => Description)
  descriptions: any;

  @BelongsTo(() => Brand)
  brand: Brand;

  @BelongsTo(() => Type)
  type: Type;
}
