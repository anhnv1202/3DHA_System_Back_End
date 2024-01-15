import { Course } from '@models/course.models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class CoursesRepository extends BaseRepository<Course> {
  constructor(@InjectModel(Course.name) courseModel: Model<Course>) {
    super(courseModel);
  }
}
