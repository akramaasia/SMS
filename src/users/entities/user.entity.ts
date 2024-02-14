import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/shared.entities/base.entity';
@Entity('sms_Users')
export class UsersEntity extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;
}
