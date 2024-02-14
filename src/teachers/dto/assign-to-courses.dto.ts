import { IsOptional } from 'class-validator';
import { CoursesEntity } from 'src/courses/entities/course.entity';


export class AssignCourseToTeacherDto {
    @IsOptional()
    courses : CoursesEntity[];
}
