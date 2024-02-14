import { IsNumber, IsOptional } from 'class-validator';
import { TeachersEntity } from 'src/teachers/entities/teacher.entity';

export class AssignToTeacherDto {
  @IsNumber()
  teacherId: number;

  @IsOptional()
  teacher?: TeachersEntity;
}
