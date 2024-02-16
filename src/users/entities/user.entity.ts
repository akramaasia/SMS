import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/shared.entities/base.entity';
import { Exclude } from 'class-transformer';
@Entity('sms_Users')
export class UsersEntity extends BaseEntity {
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;
}
