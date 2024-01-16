import { Question } from '@models/question.model';
import { CoursesRepository } from './../course/course.repository';
import { QuizzsRepository } from '@modules/quizz/quizz.repository';
import { Injectable } from '@nestjs/common';
import { TestDTO } from 'src/dto/test.dto';

@Injectable()
export class TestService {
  constructor(
    private quizzRepository: QuizzsRepository,
    private courseRepository: CoursesRepository,
  ) {}

  async create(data: TestDTO): Promise<Question[] | null> {
    const { quizzId, numberQuestion } = data;
    const quizz = (await this.quizzRepository.findById(quizzId)).toObject();
    const arrQuestion = quizz.questions;
    const totalQuestions = Math.min(numberQuestion, arrQuestion.length);
    const shuffledQuestions = [...arrQuestion];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    const selectedQuestions = shuffledQuestions.slice(0, totalQuestions);
    return selectedQuestions;
}

}
