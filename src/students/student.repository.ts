import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DbError } from 'src/shared.config/dberror.error';
import { StudentsEntity } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CoursesEntity } from 'src/courses/entities/course.entity';
import { AssignCourseToStudentDto } from './dto/assign-to-students.dto';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class StudentRepository extends Repository<StudentsEntity> {
  constructor(
    private dataSource: DataSource,
    private readonly courseService: CoursesService,
  ) {
    super(StudentsEntity, dataSource.createEntityManager());
  }

  async getAllStudents() {
    return this.find({
      relations: {
        courses: true,
      },
    }).catch((error) => {
      throw new DbError(error);
    });
  }

  async findStudentById(id: number) {
    return this.findOne({
      where: {
        id,
      },
      relations: {
        courses: true,
      },
    }).catch((error) => {
      throw new DbError(error);
    });
  }

  async createStudent(studentData: CreateStudentDto) {
    const students = this.create(studentData);
    if (studentData.coursesIds != null)
      students.courses = studentData.coursesIds.map((id) => ({
        ...new CoursesEntity(),
        id,
      }));
    return this.save(students).catch((error) => {
      throw new DbError(error);
    });
  }

  async removeStudent(id: number) {
    const studentById = await this.findStudentById(id);
    if (!studentById) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return this.delete(id).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateStudent(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.findStudentById(id);
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    const studentUpdate = { ...student, ...updateStudentDto };
    return this.save(studentUpdate).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateStudentCourses(
    id: number,
    assignCourseToStudentDto: AssignCourseToStudentDto,
  ) {
    const student = await this.findStudentById(id);

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    const students = this.create(assignCourseToStudentDto);
    const idsUsingMap = assignCourseToStudentDto.courses.map(
      (course) => course.id,
    );
    if (idsUsingMap != null)
    {
    for (let i = 0; i < idsUsingMap.length; i++) {
      const course = await this.courseService.findOne(idsUsingMap[i]);
      if (!course)
      {
        throw new NotFoundException(`course with id ${idsUsingMap[i]} not found`);

      }
      assignCourseToStudentDto.courses[i] = course;
    }
    }
    const studentUpdate = { ...student, ...assignCourseToStudentDto };
    return this.save(studentUpdate).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateStudentPut(id: number, updateStudentDto: UpdateStudentDto) {
    const studentById = await this.findStudentById(id);
    if (!studentById) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    const student = await this.findStudentById(id);
    const updateStudent = { ...student, ...updateStudentDto };
    return this.save(updateStudent).catch((error) => {
      throw new DbError(error);
    });
  }
}
