import { Module, forwardRef } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TeacherRepository } from './teachers.repository';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [forwardRef(() => CoursesModule)],
  controllers: [TeachersController],
  providers: [TeachersService, TeacherRepository],
  exports: [TeachersService],
})
export class TeachersModule {}

