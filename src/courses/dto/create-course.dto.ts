import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  courseName: string;

  @IsNumber()
  creditHours: number;

  @IsOptional()
  @IsNumber()
  teacherId: number;
}
