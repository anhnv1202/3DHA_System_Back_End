import { Option, SEARCH_BY } from '@common/constants/global.const';
import { authorFromCoursePopulate, quizzPopulate } from '@common/constants/populate.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Quizz } from '@models/quizz.model';
import { User } from '@models/user.model';
import { CoursesRepository } from '@modules/course/course.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { QuizzDTO, UpdateQuestionInQuizzDTO, UpdateQuizzDTO } from 'src/dto/quizz.dto';
import { QuizzsRepository } from './quizz.repository';

@Injectable()
export class QuizzService {
  constructor(
    private quizzRepository: QuizzsRepository,
    private courseRepository: CoursesRepository,
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
      await this.courseRepository.update(data.chapter, { $push: { quizzs: quizz } }, session);
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
    if (currentQuizz.chapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.quizzRepository.update(id, { ...data });
  }

  async updateQuestion(user: User, id: string, data: UpdateQuestionInQuizzDTO): Promise<Quizz | null> {
    const { option, question } = data;
    const currentQuizz = (await this.quizzRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentQuizz.chapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    const isQuestionExist = currentQuizz.questions.includes(question);
    if ((option === Option.ADD && isQuestionExist) || (option === Option.REMOVE && !isQuestionExist)) {
      throw new BadRequestException(isQuestionExist ? 'question-existed' : 'question-not-existed');
    }
    const updateOperation =
      option === Option.ADD ? { $push: { questions: question } } : { $pull: { questions: question } };
    return await this.quizzRepository.update(id, updateOperation);
  }

  async delete(user: User, id: string): Promise<Quizz | null> {
    const currentQuizz = (await this.quizzRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentQuizz.chapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.quizzRepository.softDelete(id);
  }
}
