import { Option, SEARCH_BY } from '@common/constants/global.const';
import { coursePopulate } from '@common/constants/populate.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { LikeStatus } from '@common/interfaces/likeStatus';
import { Course } from '@models/course.models';
import { User } from '@models/user.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CourseDTO, UpdateChapterInCourseDTO, UpdateCourseDTO, UpdateLikeInCourseDTO } from 'src/dto/course.dto';
import { CoursesRepository } from './course.repository';

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

  async updateChapter(user: User, id: string, data: UpdateChapterInCourseDTO): Promise<Course | null> {
    const { option, chapter } = data;
    const currentCourse = (await this.courseRepository.findById(id, coursePopulate)).toObject();
    if (currentCourse.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    const isChapterExist = currentCourse.chapters.includes(chapter);
    if ((option === Option.ADD && isChapterExist) || (option === Option.REMOVE && !isChapterExist)) {
      throw new BadRequestException(isChapterExist ? 'chapter-existed' : 'chapter-not-existed');
    }
    const updateOperation = option === Option.ADD ? { $push: { chapters: chapter } } : { $pull: { chapters: chapter } };
    return await this.courseRepository.update(id, updateOperation);
  }

  async delete(user: User, id: string): Promise<Course | null> {
    const currentCourse = await this.courseRepository.findById(id);
    if (currentCourse.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.courseRepository.softDelete(id);
  }

  async updateLike(user: User, id: string, data: UpdateLikeInCourseDTO): Promise<Course | null> {
    const currentCourse = (await this.courseRepository.findById(id, coursePopulate)).toObject();
    const currentUserIndex = currentCourse.likeInfo.findIndex(
      (likeInfo: LikeStatus) => likeInfo.user.toString() === user._id.toString(),
    );
    let updateData = {};
    updateData = { $push: { likeInfo: { user: user._id, status: data.option } } };
    if (currentUserIndex !== -1) {
      const currentUserStatus = currentCourse.likeInfo[currentUserIndex].status;
      updateData =
        currentUserStatus === data.option
          ? { $pull: { likeInfo: { user: user._id } } }
          : { likeInfo: { ...currentCourse.likeInfo[currentUserIndex], status: data.option } };
    }
    return await this.courseRepository.update(id, updateData);
  }
}
   