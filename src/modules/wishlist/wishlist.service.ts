import { CourseStatus } from '@common/constants/global.const';
import { User } from '@models/user.model';
import { CoursesRepository } from '@modules/course/course.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { LaterListDTO, WishlistDTO } from 'src/dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    private userRepository: UsersRepository,
    private courseRepository: CoursesRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getAll(user: User) {
    return (await this.userRepository.findById(user._id, [{ path: 'courseInfo.course' }])).courseInfo;
  }

  async update(user: User, data: WishlistDTO): Promise<User | null> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { option, course } = data;
      if (!(await this.courseRepository.findById(course))) {
        throw new BadRequestException('cannot-find-course');
      }
      const currentUser = (await this.userRepository.findById(user._id)).toObject();
      const isCourseExist = currentUser.courseInfo.some((courseInfo) => courseInfo.course.equals(course));
      if ((option === 1 && isCourseExist) || (option === 2 && !isCourseExist)) {
        throw new BadRequestException(option === 1 ? 'course-existed' : 'course-not-existed');
      }
      const updateOperation =
        option === 1
          ? { $push: { courseInfo: { course, status: CourseStatus.WISHLIST } } }
          : { $pull: { courseInfo: { course } } };
      await this.userRepository.update(user._id, updateOperation);
      await session.commitTransaction();
      return await this.userRepository.findById(user._id);
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async updateLaterList(user: User, data: LaterListDTO): Promise<User | null> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { course } = data;
      if (!(await this.courseRepository.findById(course))) {
        throw new BadRequestException('cannot-find-course');
      }
      const currentUser = (await this.userRepository.findById(user._id)).toObject();
      const courseInfoIndex = currentUser.courseInfo.findIndex((info) => info.course.equals(course));
      if (courseInfoIndex !== -1) {
        const updatedCourseInfo = {
          ...currentUser.courseInfo[courseInfoIndex],
          status:
            currentUser.courseInfo[courseInfoIndex].status === CourseStatus.WISHLIST
              ? CourseStatus.LATER
              : CourseStatus.WISHLIST,
        };
        currentUser.courseInfo[courseInfoIndex] = updatedCourseInfo;
        await this.userRepository.update(user._id, { courseInfo: updatedCourseInfo });
      }
      await session.commitTransaction();
      return await this.userRepository.findById(user._id);
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }
}
