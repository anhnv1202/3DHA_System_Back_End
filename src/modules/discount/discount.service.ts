import { SEARCH_BY } from '@common/constants/global.const';
import { authorFromCoursePopulate } from '@common/constants/populate.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Discount } from '@models/discount.model';
import { User } from '@models/user.model';
import { CoursesRepository } from '@modules/course/course.repository';
import { DiscountsRepository } from '@modules/discount/discount.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DiscountDTO, UpdateDiscountDTO } from 'src/dto/discount.dto';
import { discountPopulate } from './../../common/constants/populate.const';

@Injectable()
export class DiscountService {
  constructor(
    private discountsRepository: DiscountsRepository,
    private courseRepository: CoursesRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getOne(id: string): Promise<Discount> {
    return await this.discountsRepository.findById(id, discountPopulate);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Discount>> {
    const [data, total] = await this.discountsRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.DISCOUNT,
      populates: discountPopulate,
    });
    return { data, total };
  }

  async create(data: DiscountDTO): Promise<Discount | null> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const course = await this.courseRepository.findById(data.course);
      const updatedDiscount = course.discount
        ? await this.discountsRepository.update(course.discount._id, data,session)
        : (await this.courseRepository.update(data.course, {
            discount: (await this.discountsRepository.create(data)).toObject()._id,
          },session),
          null);
      await session.commitTransaction();
      return updatedDiscount;
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async update(user: User, id: string, data: UpdateDiscountDTO): Promise<Discount | null> {
    const currentDiscount = (await this.discountsRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentDiscount.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.discountsRepository.update(id, { ...data });
  }

  async delete(user: User, id: string): Promise<Discount | null> {
    const currentDiscount = (await this.discountsRepository.findById(id, authorFromCoursePopulate)).toObject();
    if (currentDiscount.course.author._id.toString() !== user._id) {
      throw new BadRequestException('permission-denied');
    }
    return await this.discountsRepository.softDelete(id);
  }
}
