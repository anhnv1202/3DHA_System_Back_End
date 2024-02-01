import { SEARCH_BY } from '@common/constants/global.const';
import { authorFromCoursePopulate, chapterPopulate } from '@common/constants/populate.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Chapter } from '@models/chapter.model';
import { User } from '@models/user.model';
import { CoursesRepository } from '@modules/course/course.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { ChapterDTO, UpdateChapterDTO, UpdateQuizzInChapterDTO } from 'src/dto/chapter.dto';
import { ChaptersRepository } from './chapter.repository';

@Injectable()
export class ChapterService {
  constructor(
    private chapterRepository: ChaptersRepository,
    private courseRepository: CoursesRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getOne(id: string): Promise<Chapter> {
    return await this.chapterRepository.findById(id, chapterPopulate);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Chapter>> {
    const [data, total] = await this.chapterRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.CHAPTER,
      populates: chapterPopulate,
    });
    return { data, total };
  }

  async create(data: ChapterDTO): Promise<Chapter | null> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const chapter = await this.chapterRepository.create(data);
      await this.courseRepository.update(data.course, { $push: { chapters: chapter } });
      await session.commitTransaction();
      return chapter;
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async update(user: User, id: string, data: UpdateChapterDTO): Promise<Chapter | null> {
    const currentChapter = (await this.chapterRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentChapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.chapterRepository.update(id, { ...data });
  }

  async updateQuizz(user: User, id: string, data: UpdateQuizzInChapterDTO): Promise<Chapter | null> {
    const { option, quizz } = data;
    const currentChapter = (await this.chapterRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentChapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    const isQuizzExist = currentChapter.questions.includes(new mongoose.Types.ObjectId(quizz));
    if ((option === 1 && isQuizzExist) || (option === 2 && !isQuizzExist)) {
      throw new BadRequestException(isQuizzExist ? 'quizz-existed' : 'quizz-not-existed');
    }
    const updateOperation = option === 1 ? { $push: { quizzs: quizz } } : { $pull: { quizzs: quizz } };
    return await this.chapterRepository.update(id, updateOperation);
  }

  // async updateLesson(user: User, id: string, data: UpdateLessonInChapterDTO): Promise<Chapter | null> {
  //     const { option, lesson } = data;
  //     const currentChapter = (await this.chapterRepository.findById(id, authorFromCoursePopulate)).toObject();
  //     if (currentChapter.course.author._id.toString() !== user._id) {
  //       throw new BadRequestException('permission-denied');
  //     }
  // const isLessonExist = currentChapter.lessons.includes(new mongoose.Types.ObjectId(lesson));
  // if ((option === 1 && isLessonExist) || (option === 2 && !isLessonExist)) {
  //   throw new BadRequestException(isLessonExist ? 'lesson-existed' : 'lesson-not-existed');
  // }
  // const updateOperation = option === 1 ? { $push: { lessons: lesson } } : { $pull: { lessons: lesson } };
  // return await this.chapterRepository.update(id, updateOperation);
  // }

  async delete(user: User, id: string): Promise<Chapter | null> {
    const currentChapter = (await this.chapterRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentChapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.chapterRepository.softDelete(id);
  }
}
