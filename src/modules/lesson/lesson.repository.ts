import { Lesson } from '@models/lesson.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class LessonsRepository extends BaseRepository<Lesson> {
  constructor(@InjectModel(Lesson.name) lessonModel: Model<Lesson>) {
    super(lessonModel);
  }
}
