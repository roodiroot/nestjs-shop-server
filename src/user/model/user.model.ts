import { Table, Column, Model, BelongsToMany } from 'sequelize-typescript';
import { Role } from 'src/role/model/role.model';
import { UserRole } from './user_role.model';

interface UserCreatAttr {
  email: string;
  username: string;
  password: string;
}

@Table({ tableName: 'users', updatedAt: false, createdAt: false })
export class User extends Model<User, UserCreatAttr> {
  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ allowNull: false })
  username: string;

  @Column
  password: string;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];
}
