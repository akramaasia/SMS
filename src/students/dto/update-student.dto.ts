import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  courses: CreateCourseDto[];
}
