import { Quizz } from '@models/quizz.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class QuizzsRepository extends BaseRepository<Quizz> {
  constructor(@InjectModel(Quizz.name) quizzModel: Model<Quizz>) {
    super(quizzModel);
  }
}
