import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentRepository } from './student.repository';
import { AssignCourseToStudentDto } from './dto/assign-to-students.dto';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly courseService: CoursesService,
  ) {}

  create(creatStudentDto: CreateStudentDto) {
    try {
      return this.studentRepository.createStudent(creatStudentDto);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    try {
      return this.studentRepository.getAllStudents();
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    try {
      return this.studentRepository.findStudentById(id);
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      return this.studentRepository.updateStudent(id, updateStudentDto);
    } catch (error) {
      throw error;
    }
  }

  async updateStudentCourses(
    id: number,
    assignCourseToStudentDto: AssignCourseToStudentDto,
  ) {
    try {
      return this.studentRepository.updateStudentCourses(
        id,
        assignCourseToStudentDto,
      );
    } catch (error) {
      throw error;
    }
  }

  updatePut(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      return this.studentRepository.updateStudentPut(id, updateStudentDto);
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    try {
      return this.studentRepository.removeStudent(id);
    } catch (error) {
      throw error;
    }
  }
}
