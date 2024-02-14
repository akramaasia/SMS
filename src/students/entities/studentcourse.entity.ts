import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../shared.entities/base.entity';
import { StudentsEntity } from 'src/students/entities/student.entity';
import { CoursesEntity } from 'src/courses/entities/course.entity';

@Entity('sms_studentcourses')
export class StudentCourseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @PrimaryColumn({ name: 'student_id' })
  studentId: number;

  @PrimaryColumn({ name: 'course_id' })
  courseId: number;

  @ManyToOne(() => StudentsEntity, (student) => student.courses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  students: StudentsEntity[];

  @ManyToOne(() => CoursesEntity, (course) => course.students, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  courses: CoursesEntity[];
}
