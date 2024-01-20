import { BadRequestException, Injectable } from '@nestjs/common';
import { CoursesRepository } from './course.repository';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { SEARCH_BY } from '@common/constants/global.const';
import { Course } from '@models/course.models';
import { CourseDTO, UpdateCourseDTO } from 'src/dto/course.dto';
import { User } from '@models/user.model';
import { coursePopulate } from '@common/constants/populate.const';

@Injectable()
export class CourseService {
  constructor(private courseRepository: CoursesRepository) {}

  async getOne(id: string): Promise<Course> {
    return await this.courseRepository.findById(id,coursePopulate);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Course>> {
    const [data, total] = await this.courseRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.COURSE,
      populates: coursePopulate,
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
    const quizzs = currentCourse.quizzs.toString();
    const isQuestionExist = quizzs.includes(data.quizz);
    if (isQuestionExist) throw new BadRequestException('quizz-existed');
    return await this.courseRepository.update(id, {
      ...data,
      ...(data.quizz && { $push: { quizzs: data.quizz } }),
    });
  }

  async delete(user: User, id: string): Promise<Course | null> {
    const currentCourse = await this.courseRepository.findById(id);
    if (currentCourse.author._id !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.courseRepository.softDelete(id);
  }
}
