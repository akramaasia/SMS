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
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTeacherDto: UpdateTeacherDto) {
    const teacher = this.teachersService.findOne(id);
    if (!teacher) {
      throw new NotFoundException('Record not found');
    }
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const teacher = this.teachersService.findOne(id);
    if (!teacher) {
      throw new NotFoundException('Record not found');
    }
    return this.teachersService.remove(+id);
  }
  
  @Put(':id')
  updateData(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    const teacher = this.teachersService.findOne(id);
    if (!teacher) {
      throw new NotFoundException('Record not found');
    }
    return this.teachersService.updatePut(id, updateTeacherDto);
  }
}
