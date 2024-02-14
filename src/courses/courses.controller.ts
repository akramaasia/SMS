import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignToTeacherDto } from './dto/assign-to-teacher.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch('assigntoteacher/:id')
  updateTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignToTeacherDto: AssignToTeacherDto,
  ) {
    return this.coursesService.assignCourseToTeacher(id, assignToTeacherDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTeacherDto: UpdateCourseDto) {
    const teacher = this.coursesService.findOne(id);
    if (!teacher) {
      throw new NotFoundException('Record not found');
    }
    return this.coursesService.update(+id, updateTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }

  @Put(':id')
  updateData(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updatePut(id, updateCourseDto);
  }
}
