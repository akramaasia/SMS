import { Module, forwardRef } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentRepository } from './student.repository';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [forwardRef(() => CoursesModule)],
  controllers: [StudentsController],
  providers: [StudentsService, StudentRepository],
  exports: [StudentsService],
})
export class StudentsModule {}
