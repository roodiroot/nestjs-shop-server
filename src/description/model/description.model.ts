import {
  BelongsTo,
  Column,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Products } from 'src/products/models/products.model';

interface DescripCreationAtrr {
  productId: number;
  title: string;
  description: string;
}

@Table({ tableName: 'description', updatedAt: false, createdAt: false })
export class Description extends Model<Description, DescripCreationAtrr> {
  @ForeignKey(() => Products)
  @Column
  productId: number;

  @Column
  title: string;

  @Column
  description: string;

  @BelongsTo(() => Products)
  product: number;
}
