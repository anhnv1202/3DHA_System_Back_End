import { User } from '@models/user.model';
import { CouponsRepository } from '@modules/coupon/coupon.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
// import { EnrollmentDTO } from 'src/dto/enrollment.dto';
import { SEARCH_BY } from '@common/constants/global.const';
import {
  enrollmentFromUserPopulate,
  enrollmentPopulate,
  wishlistFromUserPopulate,
} from '@common/constants/populate.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Enrollment } from '@models/enrollment.model';
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

  async getAll(pagination: Pagination): Promise<PaginationResult<Enrollment>> {
    const [data, total] = await this.enrollmentsRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.ENROLLMENT,
      populates: enrollmentPopulate,
    });
    return { data, total };
  }

  async getCurrent(user: User) {
    return (await this.userRepository.findById(user._id, enrollmentFromUserPopulate)).enrollment;
  }

  async create(user: User, data) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const courseList = [];
      const currentCourses = (await this.userRepository.findById(user._id, wishlistFromUserPopulate)).toObject();
      const wishlist = currentCourses.wishlist;
      if (wishlist.length <= 0) {
        throw new BadRequestException('wishlist-empty');
      }
      let totalCoursePrice = wishlist.reduce((sum, course) => {
        if (course.discount) {
          if (course.discount.limit <= 0 || new Date(course.discount.expired) < new Date()) {
            throw new BadRequestException('discount-expired');
          }
          if (course.discount.limit) {
            this.discountsRepository.update(course.discount._id, {
              limit: (course.discount.limit -= 1),
            });
          }
          this.courseRepository.update(course._id, {
            sold: (course.sold += 1),
          });
          courseList.push(course._id.toString());
          return course.price * (1 - course.discount.promotion / 100) + sum;
        }
        this.courseRepository.update(course._id, {
          sold: (course.sold += 1),
        });
        courseList.push(course._id.toString());
        return course.price + sum;
      }, 0);

      if (data.coupon) {
        const currentCoupon = await this.couponsRepository.findById(data.coupon);
        if (!currentCoupon) {
          throw new BadRequestException('coupon-not-existed');
        }
        if (currentCoupon.limit <= 0 || new Date(currentCoupon.expired) < new Date()) {
          throw new BadRequestException('coupon-expired');
        }
        totalCoursePrice = totalCoursePrice * (1 - currentCoupon.promotion / 100);
        if (currentCoupon.limit) {
          this.couponsRepository.update(data.coupon, {
            limit: (currentCoupon.limit -= 1),
          });
        }
      }

      const newEnrollment = await this.enrollmentsRepository.create({
        courseList,
        orderBy: user._id,
        totalPrice: totalCoursePrice,
        ...(data.coupon ? { coupon: data.coupon } : {}),
      });

      await this.userRepository.update(user._id, { wishlist: [], $push: { enrollment: newEnrollment._id } });
      await session.commitTransaction();
      return newEnrollment;
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async update(user: User, id: string, data): Promise<User | null> {
    const currentEnrollment = await this.enrollmentsRepository.update(id, { status: data.status });
    const update =
      data.status === 2
        ? await this.userRepository.update(user._id, { courseList: currentEnrollment.courseList })
        : await this.userRepository.findById(user._id);
    return update;
  }
}
