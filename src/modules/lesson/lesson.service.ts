import { SEARCH_BY } from '@common/constants/global.const';
import { authorFromChapterPopulate, lessonPopulate } from '@common/constants/populate.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Lesson } from '@models/lesson.model';
import { User } from '@models/user.model';
import { ChaptersRepository } from '@modules/chapter/chapter.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { LessonDTO, UpdateLessonDTO } from 'src/dto/lesson.dto';
import { LessonsRepository } from './lesson.repository';

@Injectable()
export class LessonService {
  constructor(
    private lessonRepository: LessonsRepository,
    private chapterRepository: ChaptersRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getOne(id: string): Promise<Lesson> {
    return await this.lessonRepository.findById(id);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Lesson>> {
    const [data, total] = await this.lessonRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.LESSON,
      populates: lessonPopulate,
    });
    return { data, total };
  }

  async create(data: LessonDTO): Promise<Lesson> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const lesson = await this.lessonRepository.create(data);
      await this.chapterRepository.update(data.chapter, { $push: { lessons: lesson } });
      await session.commitTransaction();
      return lesson;
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async update(user: User, id: string, data: UpdateLessonDTO): Promise<Lesson | null> {
    const currentLesson = (await this.lessonRepository.findById(id, authorFromChapterPopulate)).toObject();
    if (currentLesson.chapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.lessonRepository.update(id, { ...data });
  }

  async delete(user: User, id: string): Promise<Lesson | null> {
    const currentLesson = (await this.lessonRepository.findById(id, authorFromChapterPopulate)).toObject();
    if (currentLesson.chapter.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.lessonRepository.softDelete(id);
  }
}
