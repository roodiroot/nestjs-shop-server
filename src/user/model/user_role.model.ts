import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/role/model/role.model';
import { User } from './user.model';

@Table({ tableName: 'user_role', createdAt: false, updatedAt: false })
export class UserRole extends Model<UserRole> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Role)
  @Column
  roleId: number;
}
