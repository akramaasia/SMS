//export class Student {}
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'src/shared.entities/base.entity';
import { StudentCourseEntity } from 'src/students/entities/studentcourse.entity';
import { CoursesEntity } from 'src/courses/entities/course.entity';

@Entity('sms_students')
export class StudentsEntity extends BaseEntity {
  @Column()
  studentName: string;

  @Column()
  age: number;

  @Column()
  contactNo: string;

  @Column()
  registrationYear: number;

  @ManyToMany(() => CoursesEntity, (courses) => courses.students, {
    onDelete: 'CASCADE',
  })
  courses: CoursesEntity[];
}
