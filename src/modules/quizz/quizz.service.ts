import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { QuizzsRepository } from './quizz.repository';
import { Quizz } from '@models/quizz.model';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { User } from '@models/user.model';
import { QuizzDTO, UpdateQuizzDTO,UpdateQuestionInQuizzDTO } from 'src/dto/quizz.dto';
import { SEARCH_BY } from '@common/constants/global.const';
import { CoursesRepository } from '@modules/course/course.repository';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { authorFromCoursePopulate, quizzPopulate } from '@common/constants/populate.const';
import { QuestionsRepository } from '@modules/question/question.repository';

@Injectable()
export class QuizzService {
  constructor(
    private quizzRepository: QuizzsRepository,
    private courseRepository: CoursesRepository,
    private questionsRepository: QuestionsRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getOne(id: string): Promise<Quizz> {
    return await this.quizzRepository.findById(id, quizzPopulate);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Quizz>> {
    const [data, total] = await this.quizzRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.COURSE,
      populates: quizzPopulate,
    });
    return { data, total };
  }

  async create(data: QuizzDTO): Promise<Quizz> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const quizz = await this.quizzRepository.create(data);
      await this.courseRepository.update(data.course, { $push: { quizzs: quizz } });
      await session.commitTransaction();
      return quizz;
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async update(user: User, id: string, data: UpdateQuizzDTO): Promise<Quizz | null> {
    const currentQuizz = (await this.quizzRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentQuizz.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.quizzRepository.update(id, { ...data });
  }

  async updateQuestion(user: User, id: string, data: UpdateQuestionInQuizzDTO): Promise<Quizz | null> {
    const { option, question } = data;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const currentQuizz = (await this.quizzRepository.findById(id, authorFromCoursePopulate)).toObject();
      if (currentQuizz.course.author._id.toString() !== user._id) {
        throw new BadRequestException('permission-denied');
      }
      const existQuestion = await this.questionsRepository.findById(question.toString());
      if (!existQuestion) {
        throw new BadRequestException('cannot-find-question');
      }
      const questions = currentQuizz.questions.toString();
      const isQuestionExist = questions.includes(question);
      if (option === 1) {
        if (isQuestionExist) throw new BadRequestException('question-existed');
        return await this.quizzRepository.update(id, { $push: { questions: question } });
      }
      if (option === 2) {
        if (!isQuestionExist) throw new BadRequestException('question-not-existed');
        return await this.quizzRepository.update(id, { $pull: { questions: question } });
      }
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async delete(user: User, id: string): Promise<Quizz | null> {
    const currentQuizz = (await this.quizzRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentQuizz.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.quizzRepository.softDelete(id);
  }
}
