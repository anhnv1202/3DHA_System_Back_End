import { CourseStatus } from '@common/constants/global.const';
import { Course } from '@models/course.models';

export interface CourseInfo {
  course: Course;
  status: CourseStatus;
}
