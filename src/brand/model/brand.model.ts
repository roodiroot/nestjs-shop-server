import {
  Model,
  Table,
  Column,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Products } from 'src/products/models/products.model';
import { Type } from 'src/type/model/type.model';
import { BrandType } from './brand-type.model';

interface BrandCreationAtrr {
  name: string;
  brandСountry: string;
}

@Table({ tableName: 'brands', updatedAt: false, createdAt: false })
export class Brand extends Model<Brand, BrandCreationAtrr> {
  @Column
  name: string;

  @Column
  brandСountry: string;

  @HasMany(() => Products)
  products: Products[];

  @BelongsToMany(() => Type, () => BrandType)
  types: Type[];
}
