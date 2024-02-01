import { Quizz, QuizzSchema } from '@models/quizz.model';
import { ChapterModule } from '@modules/chapter/chapter.module';
import { QuestionModule } from '@modules/question/question.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzController } from './quizz.controller';
import { QuizzsRepository } from './quizz.repository';
import { QuizzService } from './quizz.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Quizz.name, schema: QuizzSchema }]), ChapterModule, QuestionModule],
  controllers: [QuizzController],
  providers: [QuizzsRepository, QuizzService],
  exports: [QuizzsRepository, QuizzService],
})
export class QuizzModule {}
