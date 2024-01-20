import { Module } from '@nestjs/common';
import { QuizzController } from './quizz.controller';
import { QuizzService } from './quizz.service';
import { Quizz, QuizzSchema } from '@models/quizz.model';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzsRepository } from './quizz.repository';
import { CourseModule } from '@modules/course/course.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Quizz.name, schema: QuizzSchema }]), CourseModule],
  controllers: [QuizzController],
  providers: [QuizzsRepository, QuizzService],
  exports: [QuizzsRepository, QuizzService],
})
export class QuizzModule {}
