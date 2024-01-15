import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from '@models/question.model';
import { QuestionsRepository } from './question.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }])],
  controllers: [QuestionController],
  providers: [QuestionsRepository, QuestionService],
  exports: [QuestionsRepository, QuestionService],
})
export class QuestionModule {}
