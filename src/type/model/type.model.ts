import {
  Model,
  Table,
  Column,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { BrandType } from 'src/brand/model/brand-type.model';
import { Brand } from 'src/brand/model/brand.model';
import { Products } from 'src/products/models/products.model';

interface TypeCreationAtrr {
  typeName: string;
}

@Table({ tableName: 'types', updatedAt: false, createdAt: false })
export class Type extends Model<Type, TypeCreationAtrr> {
  @Column
  typeName: string;

  @HasMany(() => Products)
  products: Products[];

  @BelongsToMany(() => Brand, () => BrandType)
  brands: Brand[];
}
