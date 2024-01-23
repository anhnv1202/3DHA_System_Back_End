import { BadRequestException, Injectable } from '@nestjs/common';
import { CoursesRepository } from './course.repository';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { SEARCH_BY } from '@common/constants/global.const';
import { Course } from '@models/course.models';
import { CourseDTO, UpdateChapterInCourseDTO, UpdateCourseDTO, UpdateQuizzInCourseDTO } from 'src/dto/course.dto';
import { User } from '@models/user.model';
import { coursePopulate } from '@common/constants/populate.const';

@Injectable()
export class CourseService {
  constructor(private courseRepository: CoursesRepository) {}

  async getOne(id: string): Promise<Course> {
    return await this.courseRepository.findById(id, coursePopulate);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Course>> {
    const [data, total] = await this.courseRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.COURSE,
    });
    return { data, total };
  }

  async create(user: User, data: CourseDTO): Promise<Course | null> {
    const courseData = { ...data, author: user._id };
    return await this.courseRepository.create({ ...courseData });
  }

  async update(user: User, id: string, data: UpdateCourseDTO): Promise<Course | null> {
    const currentCourse = (await this.courseRepository.findById(id, coursePopulate)).toObject();
    if (currentCourse.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.courseRepository.update(id, { ...data });
  }

  async updateQuizz(user: User, id: string, data: UpdateQuizzInCourseDTO): Promise<Course | null> {
    const { option, quizz } = data;
    const currentCourse = (await this.courseRepository.findById(id, coursePopulate)).toObject();
    if (currentCourse.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    const quizzs = currentCourse.quizzs.toString();
    const isQuizzExist = quizzs.includes(quizz);
    if (option === 1) {
      if (isQuizzExist) throw new BadRequestException('quizz-existed');
      return await this.courseRepository.update(id, { $push: { quizzs: quizz } });
    }
    if (option === 2) {
      if (!isQuizzExist) throw new BadRequestException('quizz-not-existed');
      return await this.courseRepository.update(id, { $pull: { quizzs: quizz } });
    }
  }

  async updateChapter(user: User, id: string, data: UpdateChapterInCourseDTO): Promise<Course | null> {
    const { option, chapter } = data;
    const currentCourse = (await this.courseRepository.findById(id, coursePopulate)).toObject();
    if (currentCourse.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    const chapters = currentCourse.chapters.toString();
    const isChapterExist = chapters.includes(chapter);
    if (option === 1) {
      if (isChapterExist) throw new BadRequestException('chapter-existed');
      return await this.courseRepository.update(id, { $push: { chapters: chapter } });
    }
    if (option === 2) {
      if (!isChapterExist) throw new BadRequestException('chapter-not-existed');
      return await this.courseRepository.update(id, { $pull: { chapters: chapter } });
    }
  }

  async delete(user: User, id: string): Promise<Course | null> {
    const currentCourse = await this.courseRepository.findById(id);
    if (currentCourse.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.courseRepository.softDelete(id);
  }
}
