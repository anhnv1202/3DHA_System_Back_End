import { Question } from '@models/question.model';
import { QuizzsRepository } from '@modules/quizz/quizz.repository';
import { OutcomeDTO } from 'src/dto/outcome.dto';
import { QuestionsRepository } from '@modules/question/question.repository';
import { User } from '@models/user.model';
import { OutcomesRepository } from './outcome.repository';
import { Injectable } from '@nestjs/common';
import { OutcomeListsRepository } from '@modules/outcome-list/outcome-list.repository';

@Injectable()
export class OutcomeService {
  constructor(
    private quizzRepository: QuizzsRepository,
    private questionRepository: QuestionsRepository,
    private outcomeRepository: OutcomesRepository,
    private outcomeListRepository: OutcomeListsRepository,
  ) {}

  async create(user: User, data: OutcomeDTO): Promise<Question[] | null> {
    const { quizzId, numberQuestion } = data;
    const quizz = (
      await this.quizzRepository.findById(quizzId, [
        { path: 'questions', select: '-outcome -deletedAt -createdAt -updatedAt -__v' },
        { path: 'course' },
        { path: 'outcomeList' },
      ])
    ).toObject();

    // const courseList = user.courseList;
    // const isEnroll = courseList.included(quizz.course);
    // if (!isEnroll) {
    //   throw new BadRequestException('permission-denied');
    // }
    const outcomeList = quizz.outcomeList;
    const userExistsInOutcomeList = outcomeList.some((element) => element.user._id === user._id);
    if (!userExistsInOutcomeList) {
      await this.outcomeListRepository.create(user);
    }

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

  async calculate(user: User, data: any) {
    const { quizzId, questions } = data;
    const numberQuestion = questions.length;
    let wrongAnswer = 0;
    let noAnswer = 0;
    for (const item of questions) {
      const questionId = Object.keys(item)[0];
      const userAnswer = item[questionId];
      const question = (await this.questionRepository.findById(questionId)).toObject();
      if (question) {
        if (userAnswer !== 'E') {
          if (question.outcome !== userAnswer) {
            wrongAnswer++;
          }
        } else noAnswer++;
      }
    }
    const correctAnswer = numberQuestion - wrongAnswer - noAnswer;
    const score = (correctAnswer / numberQuestion) * 10;
    const outcomeData = { numberQuestion, noAnswer, wrongAnswer, score };
    const outcome = await this.outcomeRepository.create(outcomeData);
    const currentOutcomeList = await this.outcomeListRepository.findOne({ user: user._id });
    const outcomeList = await this.outcomeListRepository.update(currentOutcomeList._id, {
      ...(outcome && { $push: { outcome: outcome } }),
    });
    await this.quizzRepository.update(quizzId, {
      ...(outcomeList && { $push: { outcomeList: outcomeList } }),
    });
    return outcomeList;
  }
}
