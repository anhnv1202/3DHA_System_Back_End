import { Module } from '@nestjs/common';
import { QuizzController } from './quizz.controller';
import { QuizzService } from './quizz.service';
import { Quizz, QuizzSchema } from '@models/quizz.model';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzsRepository } from './quizz.repository';
import { CourseModule } from '@modules/course/course.module';
import { QuestionModule } from '@modules/question/question.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Quizz.name, schema: QuizzSchema }]), CourseModule, QuestionModule],
  controllers: [QuizzController],
  providers: [QuizzsRepository, QuizzService],
  exports: [QuizzsRepository, QuizzService],
})
export class QuizzModule {}
