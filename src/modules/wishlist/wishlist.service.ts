import { User } from '@models/user.model';
import { CoursesRepository } from '@modules/course/course.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { WishlistDTO } from 'src/dto/wishlist.dto';
import { LaterListDTO } from './../../dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    private userRepository: UsersRepository,
    private courseRepository: CoursesRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getAll(user: User) {
    return (await this.userRepository.findById(user._id, [{ path: 'wishlist', select: 'name' }])).wishlist;
  }

  async update(user: User, data: WishlistDTO): Promise<User | null> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { option, course } = data;
      if (!(await this.courseRepository.findById(course))) {
        throw new BadRequestException('cannot-find-course');
      }
      const currentUser = await this.userRepository.findById(user._id);
      const isCourseExistInCourseList = currentUser.courseList.includes(new mongoose.Types.ObjectId(course));
      const isCourseExistInWishlist = currentUser.wishlist.includes(new mongoose.Types.ObjectId(course));
      const isCourseExistInLaterList = currentUser.laterList.includes(new mongoose.Types.ObjectId(course));
      if (
        (option === 1 && (isCourseExistInWishlist || isCourseExistInCourseList || isCourseExistInLaterList)) ||
        (option === 2 && !isCourseExistInWishlist)
      ) {
        throw new BadRequestException(option === 1 ? 'course-existed' : 'course-not-existed');
      }
      const updateOperation = option === 1 ? { $push: { wishlist: course } } : { $pull: { wishlist: course } };
      await session.commitTransaction();
      return await this.userRepository.update(user._id, updateOperation);
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
      const currentUser = await this.userRepository.findById(user._id);
      const isCourseExistInWishlist = currentUser.wishlist.includes(new mongoose.Types.ObjectId(course));
      const isCourseExistInLaterList = currentUser.laterList.includes(new mongoose.Types.ObjectId(course));
      const updateOperation = isCourseExistInWishlist
        ? { $push: { laterList: course }, $pull: { wishlist: course } }
        : isCourseExistInLaterList
          ? { $push: { wishlist: course }, $pull: { laterList: course } }
          : null;

      if (updateOperation) {
        return await this.userRepository.update(user._id, updateOperation);
      }
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }
}
