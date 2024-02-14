import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseRepository } from './courses.repository';
import { TeachersModule } from 'src/teachers/teachers.module';

@Module({
  imports: [TeachersModule],
  controllers: [CoursesController],
  providers: [CoursesService, CourseRepository],
  exports : [CoursesService]
})
export class CoursesModule {}
