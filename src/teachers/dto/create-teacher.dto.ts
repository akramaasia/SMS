import { IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  teacherName: string;

  @IsString()
  contact: string;

  @IsString()
  department: string;

  @IsString()
  designation: string;
}
