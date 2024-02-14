import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'src/shared.entities/base.entity';
import { CoursesEntity } from 'src/courses/entities/course.entity';

@Entity('sms_teachers')
export class TeachersEntity extends BaseEntity {
  @Column()
  teacherName: string;

  @Column()
  contact: string;

  @Column()
  department: string;

  @Column()
  designation: string;

  @OneToMany(() => CoursesEntity, (courses) => courses.teacher, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  courses: CoursesEntity[];
}
