import { outcomeListPopulate } from '@common/constants/populate.const';
import { Question } from '@models/question.model';
import { User } from '@models/user.model';
import { OutcomeListsRepository } from '@modules/outcome-list/outcome-list.repository';
import { QuestionsRepository } from '@modules/question/question.repository';
import { QuizzsRepository } from '@modules/quizz/quizz.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { OutcomeDTO } from 'src/dto/outcome.dto';
import { OutcomeListDTO } from 'src/dto/outcomeList.dto';
import { OutcomesRepository } from './outcome.repository';

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
      const quizz = (
        await this.quizzRepository.findById(quizzId, [
          { path: 'questions', select: '-outcome' },
          'course',
          'outcomeList',
        ])
      ).toObject();
      if (!quizz) throw new BadRequestException('cannot-find-quizz');

      // if (!user.enroll.includes(quizz.course)) {
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
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async calculate(user: User, data: OutcomeListDTO) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { quizzId, questions } = data;
      const numberQuestion = questions.length;
      let wrongAnswers = 0;
      let noAnswers = 0;
      for (const item of questions) {
        const questionId = Object.keys(item)[0];
        const userAnswer = item[questionId];
        const question = (await this.questionRepository.findById(questionId)).toObject();
        if (!question) throw new BadRequestException('cannot-find-question');
        if (userAnswer !== 'E') {
          if (question.outcome !== userAnswer) {
            wrongAnswers++;
          }
        } else noAnswers++;
      }
      const correctAnswer = numberQuestion - wrongAnswers - noAnswers;
      const score = (correctAnswer / numberQuestion) * 10;
      const outcomeData = { numberQuestion, noAnswers, wrongAnswers, score };
      const outcome = await this.outcomeRepository.create(outcomeData);
      const currentOutcomeList = await this.outcomeListRepository.findOne({ user: user._id });
      if (!currentOutcomeList) throw new BadRequestException('cannot-find-outcomeList');

      const outcomeList = await this.outcomeListRepository.update(currentOutcomeList._id, {
        ...(outcome && { $push: { outcome: outcome._id } }),
      });

      if (!outcomeList) throw new BadRequestException('update-outcomeList-error');
      const quizz = await this.quizzRepository.findById(quizzId.toString());
      const outcomeListCurrent = quizz.outcomeList;
      if (!outcomeListCurrent.includes(outcomeList._id)) {
        const updateOutcomeList = await this.quizzRepository.update(quizzId, {
          ...(outcomeList && { $push: { outcomeList: outcomeList._id } }),
        });
        if (!updateOutcomeList) throw new BadRequestException('update-quizz-error');
      }
      await session.commitTransaction();
      return await this.outcomeListRepository.findById(currentOutcomeList._id, outcomeListPopulate);
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }
}
