import { Question } from '@models/question.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class QuestionsRepository extends BaseRepository<Question> {
  constructor(@InjectModel(Question.name) questionModel: Model<Question>) {
    super(questionModel);
  }
}
