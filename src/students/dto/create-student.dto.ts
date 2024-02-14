import { isString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    studentName: string;
  
    @IsNumber()
    age: number;
  
    @IsString()
    contactNo: string;
  
    @IsNumber()
    registrationYear: number;

    @IsOptional()
    coursesIds : number [];

}
