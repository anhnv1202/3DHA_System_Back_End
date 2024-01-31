import { CourseStatus } from '@common/constants/global.const';
import { Course } from '@models/course.models';
import { Document, PopulatedDoc, Types } from 'mongoose';

export interface CourseInfo {
  course: Course;
  status: CourseStatus;
}
