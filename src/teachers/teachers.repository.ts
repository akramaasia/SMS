import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DbError } from 'src/shared.config/dberror.error';
import { TeachersEntity } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { AssignCourseToTeacherDto } from './dto/assign-to-courses.dto';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class TeacherRepository extends Repository<TeachersEntity> {
  constructor(private dataSource: DataSource,
    ) {
    super(TeachersEntity, dataSource.createEntityManager());
  }

  async getAllTeachers() {
    return this.find({
      relations: {
        courses: true,
      },
    }).catch((error) => {
      throw new DbError(error);
    });
  }

  async findTeacherById(id: number) {
    const teacher = this.findOne({
      where: {
        id,
      },
      relations: {
        courses: true,
      },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return teacher.catch((error) => {
      throw new DbError(error);
    });
  }
  async createTeacher(teacherData: CreateTeacherDto) {
    return this.save(teacherData).catch((error) => {
      throw new DbError(error);
    });
  }
  async removeTeacher(id: number) {
    const teacher = await this.findTeacherById(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return this.delete(id).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateTeacherPut(id: number, updateTeacherDto: UpdateTeacherDto) {
    return this.update(id, updateTeacherDto).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateTeacher(id: number, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.findTeacherById(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    const teacherUpdate = { ...teacher, ...updateTeacherDto };
    return this.save(teacherUpdate).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateAssignCourses(id: number, updateAssignCourseDto: AssignCourseToTeacherDto) {
    const teacher = await this.findTeacherById(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    // const students = this.create(updateAssignCourseDto);
    // const idsUsingMap = updateAssignCourseDto.courses.map(
    //   (course) => course.id,
    // );
    // if (idsUsingMap != null) {
    //   for (let i = 0; i < idsUsingMap.length; i++) {
    //     const course = await this.courseService.findOne(idsUsingMap[i]);
    //     updateAssignCourseDto.courses[i] = course;
    //   }
    // }

    const teacherUpdate = { ...teacher, ...updateAssignCourseDto };
    return this.save(teacherUpdate).catch((error) => {
      throw new DbError(error);
    });
  }
}
