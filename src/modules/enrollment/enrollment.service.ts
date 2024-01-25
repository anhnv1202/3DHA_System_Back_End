import { User } from '@models/user.model';
import { CouponsRepository } from '@modules/coupon/coupon.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
// import { EnrollmentDTO } from 'src/dto/enrollment.dto';
import { CoursesRepository } from '@modules/course/course.repository';
import { DiscountsRepository } from '@modules/discount/discount.repository';
import { EnrollmentsRepository } from './enrollment.repository';

@Injectable()
export class EnrollmentService {
  constructor(
    private userRepository: UsersRepository,
    private enrollmentsRepository: EnrollmentsRepository,
    private couponsRepository: CouponsRepository,
    private courseRepository: CoursesRepository,
    private discountsRepository: DiscountsRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getAll(user: User) {
    return (await this.userRepository.findById(user._id, [{ path: 'wishlist', select: 'name' }])).wishlist;
  }

  async update(user: User, data) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const courseList = [];
      const currentCourses = await this.userRepository.findById(user._id, [
        { path: 'wishlist', populate: [{ path: 'discount', select: 'promotion' }] },
      ]);
      const wishlist = currentCourses.wishlist;
      if (wishlist.length <= 0) {
        throw new BadRequestException('wishlist-empty');
      }
      let totalCoursePrice = wishlist.reduce((sum, course) => {
        if ('price' in course) {
          if ('discount' in course && course.discount instanceof Object) {
            const discount = course.discount as { promotion?: number; limit?: number; _id?: string; expired?: Date };
            if ('promotion' in discount) {
              if (discount.limit <= 0 || new Date(discount.expired) > new Date()) {
                throw new BadRequestException('discount-expired');
              }
              discount.limit -= 1;
              this.discountsRepository.update(discount._id, {
                limit: discount.limit,
              });
              course.sold += 1;
              this.courseRepository.update(course._id, {
                sold: course.sold,
              });
              courseList.push(course._id.toString());
              return course.price * (1 - discount.promotion / 100) + sum;
            }
          }
          course.sold += 1;
          this.courseRepository.update(course._id, {
            sold: course.sold,
          });
          courseList.push(course._id.toString());
          return course.price + sum;
        }
        return sum;
      }, 0);

      if (data.coupon) {
        const currentCoupon = await this.couponsRepository.findById(data.coupon);
        if (!currentCoupon) {
          throw new BadRequestException('coupon-not-existed');
        }
        if (currentCoupon.limit <= 0 || new Date(currentCoupon.expired) > new Date()) {
          throw new BadRequestException('coupon-expired');
        }
        totalCoursePrice = totalCoursePrice * (1 - currentCoupon.promotion / 100);
      }
      await this.userRepository.update(user._id, { wishlist: [] });
      await session.commitTransaction();
      return await this.enrollmentsRepository.create({
        courseList,
        orderBy: user._id,
        totalPrice: totalCoursePrice,
        ...(data.coupon ? { coupon: data.coupon } : {}),
      });
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }
}
