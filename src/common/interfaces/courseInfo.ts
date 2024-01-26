import { CourseStatus } from '@common/constants/global.const';
import { Course } from '@models/course.models';
import { Types, Document, PopulatedDoc } from 'mongoose';

export interface CourseInfo {
  course: PopulatedDoc<Course & Document, Types.ObjectId>[];
  status: CourseStatus;
}
