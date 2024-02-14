import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherRepository } from './teachers.repository';
import { AssignCourseToTeacherDto } from './dto/assign-to-courses.dto';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class TeachersService {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  create(createTeacherDto: CreateTeacherDto) {
    try {
      return this.teacherRepository.createTeacher(createTeacherDto);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    try {
      return this.teacherRepository.getAllTeachers();
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    try {
      return this.teacherRepository.findTeacherById(id);
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    try {
      return this.teacherRepository.updateTeacher(id, updateTeacherDto);
    } catch (error) {
      throw error;
    }
  }
  updateAssignCourses(id: number, updateAssignCourseDto: AssignCourseToTeacherDto) {
    try {
      return this.teacherRepository.updateAssignCourses(id, updateAssignCourseDto);
    } catch (error) {
      throw error;
    }
  }
  updatePut(id: number, updateTeacherDto: UpdateTeacherDto) {
    try {
      return this.teacherRepository.updateTeacherPut(id, updateTeacherDto);
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    try {
      return this.teacherRepository.removeTeacher(id);
    } catch (error) {
      throw error;
    }
  }
}
