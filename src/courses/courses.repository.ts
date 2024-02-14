import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CoursesEntity } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { DbError } from 'src/shared.config/dberror.error';
import { AssignToTeacherDto } from './dto/assign-to-teacher.dto';

@Injectable()
export class CourseRepository extends Repository<CoursesEntity> {
  constructor(private dataSource: DataSource) {
    super(CoursesEntity, dataSource.createEntityManager());
  }

  async getAllCourses() {
    return this.find({
      relations: {
        teacher: true,
        students: true,
      },
    }).catch((error) => {
      throw new DbError(error);
    });
  }

  async findCourseById(id: number) {
    return this.findOne({
      where: {
        id,
      },
      relations: {
        teacher: true,
        students: true,
      },
    }).catch((error) => {
      throw new DbError(error);
    });
  }

  async createCourse(CourseData: CreateCourseDto) {
    return this.save(CourseData).catch((error) => {
      throw new DbError(error);
    });
  }

  async removeCourse(id: number) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return this.delete(id).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateCoursePut(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return this.update(id, updateCourseDto).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateCourse(id: number, updateCoursDto: UpdateCourseDto) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    const updateCourse = { ...course, ...updateCoursDto };
    return this.save(updateCourse).catch((error) => {
      throw new DbError(error);
    });
  }

  async assignCourseToTeacher(
    id: number,
    assignToTeacherDto: AssignToTeacherDto,
  ) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    const updateCourse = { ...course, ...assignToTeacherDto };
    return this.save(updateCourse).catch((error) => {
      throw new DbError(error);
    });
  }
}
