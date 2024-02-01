import { SEARCH_BY } from '@common/constants/global.const';
import { authorFromChapterPopulate, quizzPopulate } from '@common/constants/populate.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Quizz } from '@models/quizz.model';
import { User } from '@models/user.model';
import { ChaptersRepository } from '@modules/chapter/chapter.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { QuizzDTO, UpdateQuestionInQuizzDTO, UpdateQuizzDTO } from 'src/dto/quizz.dto';
import { QuizzsRepository } from './quizz.repository';

@Injectable()
export class QuizzService {
  constructor(
    private quizzRepository: QuizzsRepository,
    private chapterRepository: ChaptersRepository,
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
      await this.chapterRepository.update(data.chapter, { $push: { quizzs: quizz } });
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
    const currentQuizz = (await this.quizzRepository.findById(id, authorFromChapterPopulate)).toObject();
    if (currentQuizz.chapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.quizzRepository.update(id, { ...data });
  }

  async updateQuestion(user: User, id: string, data: UpdateQuestionInQuizzDTO): Promise<Quizz | null> {
    const { option, question } = data;
    const currentQuizz = (await this.quizzRepository.findById(id, authorFromChapterPopulate)).toObject();
    if (currentQuizz.chapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    const isQuestionExist = currentQuizz.questions.includes(new mongoose.Types.ObjectId(question));
    if ((option === 1 && isQuestionExist) || (option === 2 && !isQuestionExist)) {
      throw new BadRequestException(isQuestionExist ? 'question-existed' : 'question-not-existed');
    }
    const updateOperation = option === 1 ? { $push: { questions: question } } : { $pull: { questions: question } };
    return await this.quizzRepository.update(id, updateOperation);
  }

  async delete(user: User, id: string): Promise<Quizz | null> {
    const currentQuizz = (await this.quizzRepository.findById(id, authorFromChapterPopulate)).toObject();
    if (currentQuizz.chapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.quizzRepository.softDelete(id);
  }
}
