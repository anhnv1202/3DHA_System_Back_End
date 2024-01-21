import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChaptersRepository } from './chapter.respository';
import { Chapter } from '@models/chapter.model';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { SEARCH_BY } from '@common/constants/global.const';
import { authorFromCoursePopulate, chapterPopulate } from '@common/constants/populate.const';
import { ChapterDTO, UpdateChapterDTO } from 'src/dto/chapter.dto';
import { CoursesRepository } from '@modules/course/course.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User } from '@models/user.model';

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
    const chapters = currentChapter.lessons.toString();
    const isQuestionExist = chapters.includes(data.lesson);
    if (isQuestionExist) throw new BadRequestException('exist');
    return await this.chapterRepository.update(id, {
      ...data,
      ...(data.lesson && { $push: { lessons: data.lesson } }),
    });
  }

  async delete(user: User, id: string): Promise<Chapter | null> {
    const currentChapter = (await this.chapterRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentChapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.chapterRepository.softDelete(id);
  }
}
