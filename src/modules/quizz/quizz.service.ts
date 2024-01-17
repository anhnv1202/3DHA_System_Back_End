import { BadRequestException, Injectable } from '@nestjs/common';
import { QuizzsRepository } from './quizz.repository';
import { Quizz } from '@models/quizz.model';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { User } from '@models/user.model';
import { QuizzDTO, UpdateQuizzDTO } from 'src/dto/quizz.dto';
import { SEARCH_BY } from '@common/constants/global.const';
import { CoursesRepository } from '@modules/course/course.repository';

@Injectable()
export class QuizzService {
  constructor(
    private quizzRepository: QuizzsRepository,
    private courseRepository: CoursesRepository,
  ) {}

  async getOne(id: string): Promise<Quizz> {
    return await this.quizzRepository.findById(id, ['questions']);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Quizz>> {
    const [data, total] = await this.quizzRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.COURSE,
      populates: [{ path: 'course', populate: { path: 'author', select: '_id' } }, { path: 'questions' }],
    });
    return { data, total };
  }

  async create(data: QuizzDTO): Promise<Quizz | null> {
    const quizz = await this.quizzRepository.create(data);
    await this.courseRepository.update(data.course, { $push: { quizzs: quizz } });
    return quizz;
  }

  async update(user: User, id: string, data: UpdateQuizzDTO): Promise<Quizz | null> {
    const currentQuizz = (await this.quizzRepository.findById(id, [{ path: 'course', populate: 'author' }])).toObject();
    if (currentQuizz.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    const questions = currentQuizz.questions.toString();
    const isQuestionExist = questions.includes(data.question);
    if (isQuestionExist) throw new BadRequestException('exist');
    return await this.quizzRepository.update(id, {
      ...data,
      ...(data.question && { $push: { questions: data.question } }),
    });
  }

  async delete(user: User, id: string): Promise<Quizz | null> {
    const currentQuizz = (await this.quizzRepository.findById(id, [{ path: 'course', populate: 'author' }])).toObject();
    if (currentQuizz.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.quizzRepository.softDelete(id);
  }
}
