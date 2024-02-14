import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'src/shared.entities/base.entity';
import { TeachersEntity } from 'src/teachers/entities/teacher.entity';
import { StudentsEntity } from 'src/students/entities/student.entity';

@Entity('sms_courses')
export class CoursesEntity extends BaseEntity {
  @Column()
  courseName: string;

  @Column()
  creditHours: number;

  @Column({ nullable: true })
  teacherId: number;

  @ManyToOne(() => TeachersEntity, (teacher) => teacher.courses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  teacher: TeachersEntity;

  @ManyToMany(() => StudentsEntity, (student) => student.courses, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'sms_studentcourses',
    joinColumn: {
      name: 'course_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'sms_studentcourses_course_id',
    },
    inverseJoinColumn: {
      name: 'student_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'sms_studentcourses_student_id',
    },
  })
  students: StudentsEntity[];
}
