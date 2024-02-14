import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AssignCourseToStudentDto } from './dto/assign-to-students.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    const student = this.studentsService.findOne(parseInt(id));
    if (!student) {
      throw new NotFoundException('Record not found');
    }
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Patch('assign-coursesto-students/:id')
  updateCourses(@Param('id', ParseIntPipe) id: number, @Body() assignCourseToStudentDto: AssignCourseToStudentDto) {
   
    return this.studentsService.updateStudentCourses(id, assignCourseToStudentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const student = this.studentsService.findOne(id);
    if (!student) {
      throw new NotFoundException('Record not found');
    }
    return this.studentsService.remove(+id);
  }

  @Put(':id')
  updateData(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const student = this.studentsService.findOne(id);
    if (!student) {
      throw new NotFoundException('Record not found');
    }
    return this.studentsService.updatePut(id, updateStudentDto);
  }
}
