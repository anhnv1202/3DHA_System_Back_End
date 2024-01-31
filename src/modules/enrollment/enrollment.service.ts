import { CourseStatus, Payment, SEARCH_BY } from '@common/constants/global.const';
import { enrollmentCurrentPopulate, enrollmentPopulate } from '@common/constants/populate.const';
import { CourseInfo } from '@common/interfaces/courseInfo';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Enrollment } from '@models/enrollment.model';
import { User } from '@models/user.model';
import { BillsRepository } from '@modules/bill/bill.repository';
import { CouponsRepository } from '@modules/coupon/coupon.repository';
import { CoursesRepository } from '@modules/course/course.repository';
import { DiscountsRepository } from '@modules/discount/discount.repository';
import { InvoicesRepository } from '@modules/invoice/invoice.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UpdateEnrollmentDTO } from 'src/dto/enrollment.dto';
import { EnrollmentsRepository } from './enrollment.repository';

@Injectable()
export class EnrollmentService {
  constructor(
    private userRepository: UsersRepository,
    private enrollmentsRepository: EnrollmentsRepository,
    private couponsRepository: CouponsRepository,
    private courseRepository: CoursesRepository,
    private discountRepository: DiscountsRepository,
    private billRepository: BillsRepository,
    private invoicesRepository: InvoicesRepository,
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
    return (await this.userRepository.findById(user._id, enrollmentCurrentPopulate)).enrollment;
  }

  async create(user: User, data) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const courseList = [];
      let couponPromotion = 0;
      const currentUser = (await this.userRepository.findById(user._id, ['courseInfo.course'])).toObject();
      const wishlist = currentUser.courseInfo.filter(
        (courseInfo: CourseInfo) => courseInfo.status === CourseStatus.WISHLIST,
      );
      if (wishlist.length <= 0) {
        throw new BadRequestException('wishlist-empty');
      }
      const totalCoursePriceArray = await Promise.all(
        wishlist.map(async (current) => {
          const course = await this.courseRepository.findById(current.course._id, ['discount']);
          const courseObject = course.toObject();
          if (!courseObject.discount) {
            courseList.push({
              name: current.course.name,
              price: current.course.price,
              author: current.course.author.toString(),
            });
            const updateSold = await this.courseRepository.update(current.course._id, {
              $inc: { sold: 1 },
            });
            if (!updateSold) {
              throw new BadRequestException('update-sold-error');
            }

            return current.course.price;
          }
          if (courseObject.discount.limit <= 0 || new Date(courseObject.discount.expired) < new Date()) {
            throw new BadRequestException('discount-expired');
          }
          const updateLimit = await this.discountRepository.update(courseObject.discount, {
            $inc: { limit: -1 },
          });
          if (!updateLimit) {
            throw new BadRequestException('update-limit-error');
          }
          const lastPrice = parseFloat((current.course.price * (1 - courseObject.discount.promotion / 100)).toFixed(2));
          courseList.push({
            name: current.course.name,
            price: current.course.price,
            discount: courseObject.discount.promotion,
            lastPrice: lastPrice,
            author: current.course.author.toString(),
          });
          const updateSold = await this.courseRepository.update(current.course._id, {
            $inc: { sold: 1 },
          });
          if (!updateSold) {
            throw new BadRequestException('update-sold-error');
          }
          return lastPrice;
        }),
      );
      const totalCoursePrice = totalCoursePriceArray.reduce((sum, value) => sum + value, 0);

      let lastCoursePrice = totalCoursePrice;
      if (data.coupon) {
        const currentCoupon = await this.couponsRepository.findById(data.coupon);
        if (!currentCoupon) {
          throw new BadRequestException('coupon-not-existed');
        }
        if (currentCoupon.limit <= 0 || new Date(currentCoupon.expired) < new Date()) {
          throw new BadRequestException('coupon-expired');
        }
        couponPromotion = currentCoupon.promotion;
        lastCoursePrice = parseFloat((totalCoursePrice * (1 - currentCoupon.promotion / 100)).toFixed(2));
        const updateLimit = await this.couponsRepository.update(data.coupon, {
          $inc: { limit: -1 },
        });
        if (!updateLimit) {
          throw new BadRequestException('update-limit-error');
        }
      }
      const newEnrollment = await this.enrollmentsRepository.create({
        courseList,
        orderBy: user._id,
        totalPrice: totalCoursePrice,
        lastPrice: lastCoursePrice,
        coupon: couponPromotion,
      });
      await this.userRepository.update(user._id, { $push: { enrollment: newEnrollment._id } });
      await session.commitTransaction();
      return newEnrollment;
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async update(user: User, id: string, data: UpdateEnrollmentDTO): Promise<User | null> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const currentEnrollment = (await this.enrollmentsRepository.update(id, { status: data.status })).toObject();
      const currentUser = (await this.userRepository.findById(user._id)).toObject();
      if (data.status === Payment.SUCCESSFUL) {
        const courseList = currentEnrollment.courseList;
        const invoicePromises = [];
        for (const element of courseList) {
          let adminReceipt = parseFloat((element.price * 0.15).toFixed(2));
          const authorReceipt = parseFloat((element.price * (1 - 0.15)).toFixed(2));
          adminReceipt = currentEnrollment.coupon
            ? adminReceipt - parseFloat((currentEnrollment.totalPrice - currentEnrollment.lastPrice).toFixed(2))
            : adminReceipt;
          const currentBill = await this.billRepository.create({
            course: element.name,
            authorReceipt,
            adminReceipt,
          });
          const currentInvoice = await this.invoicesRepository.insertOrUpdate(
            { user: element.author },
            { $inc: { receipt: authorReceipt }, $push: { bills: currentBill._id.toString() } },
          );
          if (!currentInvoice) {
            throw new BadRequestException('create-invoice-error');
          }
          const adminInvoice = await this.invoicesRepository.update('65b5804ca14992a505f06aec', {
            user: '65a2c87791cf6eee240147a8',
            $inc: { receipt: adminReceipt },
            $push: { bills: currentBill._id.toString() },
          });
          if (!adminInvoice) {
            throw new BadRequestException('create-invoice-error');
          }
          invoicePromises.push(Promise.resolve());
        }
        await Promise.all(invoicePromises);
        currentUser.courseInfo.forEach(async (courseInfo: CourseInfo) => {
          if (courseInfo.status === CourseStatus.WISHLIST) {
            courseInfo.status = CourseStatus.ENROLL;
          }
        });
        await this.userRepository.update(user._id, {
          courseInfo: currentUser.courseInfo,
        });
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

// async update(user: User, id: string, data: UpdateEnrollmentDTO): Promise<User | null> {
//   const currentEnrollment = (await this.enrollmentsRepository.update(id, { status: data.status })).toObject();
//   const courseList = currentEnrollment.courseList;
//   const currentUser = (await this.userRepository.findById(user._id)).toObject();

//   if (data.status === 2) {
//     await Promise.all(
//       for (const element of courseList) {
//         const adminReceipt = Number(
//           (
//             element.price * 0.15 -
//             (currentEnrollment.coupon ? currentEnrollment.totalPrice - currentEnrollment.lastPrice : 0)
//           ).toFixed(2),
//         );
//         const authorReceipt = Number((element.price * 0.85).toFixed(2));
//         const currentBill = await this.billRepository.create({ course: element.name, authorReceipt, adminReceipt });

//         await this.invoicesRepository.insertOrUpdate(
//           { user: element.author },
//           { $inc: { receipt: authorReceipt }, $push: { bills: currentBill._id.toString() } },
//         );

//         await this.invoicesRepository.update('65b5804ca14992a505f06aec', {
//           $inc: { receipt: adminReceipt },
//           $push: { bills: currentBill._id.toString() },
//         });
//       }
//     );

//     currentUser.courseInfo.forEach((courseInfo) => {
//       if (courseInfo.status === CourseStatus.WISHLIST) courseInfo.status = CourseStatus.ENROLL;
//     });

//     await this.userRepository.update(user._id, { courseInfo: currentUser.courseInfo });
//   }

//   return this.userRepository.findById(user._id);
// }
