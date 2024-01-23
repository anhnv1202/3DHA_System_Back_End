import { User } from '@models/user.model';
import { CoursesRepository } from '@modules/course/course.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { WishListDTO } from 'src/dto/wishList.dto';

@Injectable()
export class WishlistService {
  constructor(
    private userRepository: UsersRepository,
    private courseRepository: CoursesRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getAll(user: User) {
    const existUser = await this.userRepository.findById(user._id, [{ path: 'wishList', select: 'name' }]);
    return existUser.wishList;
  }

  async update(user: User, data: WishListDTO): Promise<User | null> {
    const { option, course } = data;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const existCourse = await this.courseRepository.findById(course.toString());
      if (!existCourse) throw new BadRequestException('cannot-find-course');
      const existUser = await this.userRepository.findById(user._id);
      const wishLists = existUser.wishList.toString();
      const isCourseExist = wishLists.includes(course.toString());
      if (option === 1) {
        if (isCourseExist) throw new BadRequestException('course-existed');
        return await this.userRepository.update(user._id, { $push: { wishList: course } });
      }
      if (option === 2) {
        if (!isCourseExist) throw new BadRequestException('course-not-existed');
        return await this.userRepository.update(user._id, { $pull: { wishList: course } });
      }
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }
}
