import { Question } from '@models/question.model';
import { QuizzsRepository } from '@modules/quizz/quizz.repository';
import { OutcomeDTO } from 'src/dto/outcome.dto';
import { QuestionsRepository } from '@modules/question/question.repository';
import { User } from '@models/user.model';
import { OutcomesRepository } from './outcome.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { OutcomeListsRepository } from '@modules/outcome-list/outcome-list.repository';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class OutcomeService {
  constructor(
    private quizzRepository: QuizzsRepository,
    private questionRepository: QuestionsRepository,
    private outcomeRepository: OutcomesRepository,
    private outcomeListRepository: OutcomeListsRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async create(user: User, data: OutcomeDTO): Promise<Question[] | null> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { quizzId, numberQuestion } = data;
      const quizz = (await this.quizzRepository.findById(quizzId, ['questions', 'course', 'outcomeList'])).toObject();
      if (!quizz) throw new BadRequestException('cannot find');

      // if (!user.courseList.includes(quizz.course)) {
      //   throw new BadRequestException('permission-denied');
      // }
      const userExistsInOutcomeList = quizz.outcomeList.some((element) => element.user._id === user._id);
      if (!userExistsInOutcomeList) {
        const outcomeData = { user: user._id, quizz: quizz._id };
        await this.outcomeListRepository.create(outcomeData);
      }

      const arrQuestion = quizz.questions;
      const totalQuestions = Math.min(numberQuestion, arrQuestion.length);
      const shuffledQuestions = [...arrQuestion];
      for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
      }
      const selectedQuestions = shuffledQuestions.slice(0, totalQuestions);
      await session.commitTransaction();
      return selectedQuestions;
    } catch (e) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }

  async calculate(user: User, data: any) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { quizzId, questions } = data;
      const numberQuestion = questions.length;
      let wrongAnswer = 0;
      let noAnswer = 0;
      for (const item of questions) {
        const questionId = Object.keys(item)[0];
        const userAnswer = item[questionId];
        const question = (await this.questionRepository.findById(questionId)).toObject();
        if (!question) throw new BadRequestException('cannot find');
        if (userAnswer !== 'E') {
          if (question.outcome !== userAnswer) {
            wrongAnswer++;
          }
        } else noAnswer++;
      }
      const correctAnswer = numberQuestion - wrongAnswer - noAnswer;
      const score = (correctAnswer / numberQuestion) * 10;
      const outcomeData = { numberQuestion, noAnswer, wrongAnswer, score };
      const outcome = await this.outcomeRepository.create(outcomeData);
      const currentOutcomeList = await this.outcomeListRepository.findOne({ user: user._id });
      if (!currentOutcomeList) throw new BadRequestException('cannot find');
      const outcomeList = await this.outcomeListRepository.update(currentOutcomeList._id, {
        ...(outcome && { $push: { outcome: outcome } }),
      });
      if (!outcomeList) throw new BadRequestException('update error');
      const updateOutcomeList = await this.quizzRepository.update(quizzId, {
        ...(outcomeList && { $push: { outcomeList: outcomeList } }),
      });
      if (!updateOutcomeList) throw new BadRequestException('update error');
      await session.commitTransaction();
      return outcomeList;
    } catch (e) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
