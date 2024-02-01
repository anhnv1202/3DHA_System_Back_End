import { CourseStatus } from '@common/constants/global.const';
import { ratingPopulate } from '@common/constants/populate.const';
import { CourseInfo } from '@common/interfaces/courseInfo';
import { RatingInfo } from '@common/interfaces/ratingInfo';
import { Rating } from '@models/rating.model';
import { User } from '@models/user.model';
import { CoursesRepository } from '@modules/course/course.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RatingDTO, UpdateRatingDTO } from 'src/dto/rating.dto';
import { RatingsRepository } from './rating.repository';

@Injectable()
export class RatingService {
  constructor(
    private ratingRepository: RatingsRepository,
    private courseRepository: CoursesRepository,
    private userRepository: UsersRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async create(user: User, data: RatingDTO): Promise<Rating> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { star, comment } = data;
      const currentUser = (await this.userRepository.findById(user._id, ['courseInfo.course'])).toObject();
      const isInWishlist: CourseInfo[] = currentUser.courseInfo.some(
        (courseInfo: CourseInfo) =>
          courseInfo.status === CourseStatus.ENROLL && courseInfo.course._id.toString() === data.course,
      );
      if (!isInWishlist) {
        throw new BadRequestException('permission-denied');
      }
      const currentCourse = (await this.courseRepository.findById(data.course, ['ratings'])).toObject();
      const hasUserRated: RatingInfo[] = currentCourse.ratings.some(
        (rating: RatingInfo) => rating.postedBy.toString() === user._id,
      );
      if (hasUserRated) {
        throw new BadRequestException('you-already-rating');
      }
      const totalRatings = (currentCourse.totalRatings + data.star) / (currentCourse.ratings.length + 1);
      const rating = await this.ratingRepository.create({ star, comment, postedBy: user._id.toString() }, session);
      await this.courseRepository.update(data.course, { $set: { totalRatings }, $push: { ratings: rating } }, session);
      await session.commitTransaction();
      return rating;
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async update(user: User, id: string, data: UpdateRatingDTO): Promise<Rating | null> {
    const currentRating = (await this.ratingRepository.findById(id, ratingPopulate)).toObject();
    if (currentRating.postedBy._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.ratingRepository.update(id, { ...data });
  }

  async delete(user: User, id: string): Promise<Rating | null> {
    const currentRating = (await this.ratingRepository.findById(id, ratingPopulate)).toObject();
    if (currentRating.postedBy._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.ratingRepository.softDelete(id);
  }
}
