import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/model/user.model';
import { UserRole } from 'src/user/model/user_role.model';

interface CreateRoleAtrr {
  name: string;
  description: string;
}

@Table({ tableName: 'role', updatedAt: false, createdAt: false })
export class Role extends Model<Role, CreateRoleAtrr> {
  @Column
  name: string;

  @Column
  description: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}
