import { Injectable , NotFoundException} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseRepository } from './courses.repository';
import { error } from 'console';
import { AssignToTeacherDto } from './dto/assign-to-teacher.dto';
import { TeachersService } from 'src/teachers/teachers.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CourseRepository,
    private readonly teacherService: TeachersService,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    try {
      return this.coursesRepository.createCourse(createCourseDto);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.coursesRepository.getAllCourses();
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    try {
      return this.coursesRepository.findCourseById(id);
    } catch (err) {
      throw error;
    }
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    try {
      return this.coursesRepository.updateCourse(id, updateCourseDto);
    } catch (error) {
      throw error;
    }
  }

  async assignCourseToTeacher(
    id: number,
    assignToTeacherDto: AssignToTeacherDto,
  ) {
    try {
      const teacher = await this.teacherService.findOne(
        assignToTeacherDto.teacherId,
      );
      if (!teacher)
      {
        throw new NotFoundException(`Teacher with id ${assignToTeacherDto.teacherId} not found`);

      }
      assignToTeacherDto.teacher = teacher;
      return this.coursesRepository.assignCourseToTeacher(
        id,
        assignToTeacherDto,
      );
    } catch (error) {
      throw error;
    }
  }

  updatePut(id: number, updateCourseDto: UpdateCourseDto) {
    try {
      return this.coursesRepository.updateCoursePut(id, updateCourseDto);
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    try {
      return this.coursesRepository.removeCourse(id);
    } catch (error) {
      throw error;
    }
  }
}
