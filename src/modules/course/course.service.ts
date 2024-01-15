import { BadRequestException, Injectable } from '@nestjs/common';
import { CoursesRepository } from './course.repository';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { SEARCH_BY } from '@common/constants/global.const';
import { Course } from '@models/course.models';
import { CourseDTO, UpdateCourseDTO } from 'src/dto/course.dto';
import { User } from '@models/user.model';

@Injectable()
export class CourseService {
  constructor(private courseRepository: CoursesRepository) {}

  async getOne(id: string): Promise<Course> {
    return await this.courseRepository.findById(id);
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
    const currentCourse = await this.courseRepository.findById(id);
    if (currentCourse.author !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.courseRepository.update(id, { ...data });
  }

  async delete(user: User, id: string): Promise<Course | null> {
    const currentCourse = await this.courseRepository.findById(id);
    if (currentCourse.author !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.courseRepository.softDelete(id);
  }
}
