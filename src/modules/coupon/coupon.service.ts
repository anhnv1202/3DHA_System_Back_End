import { SEARCH_BY } from '@common/constants/global.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Coupon } from '@models/coupon.model';
import { Injectable } from '@nestjs/common';
import { CouponDTO, UpdateCouponDTO } from 'src/dto/coupon.dto';
import { CouponsRepository } from './coupon.repository';

@Injectable()
export class CouponService {
  constructor(private couponRepository: CouponsRepository) {}

  async getOne(id: string): Promise<Coupon> {
    return await this.couponRepository.findById(id);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Coupon>> {
    const [data, total] = await this.couponRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.COUPON,
    });
    return { data, total };
  }

  async create(data: CouponDTO): Promise<Coupon | null> {
    return await this.couponRepository.create({ ...data });
  }

  async update(id: string, data: UpdateCouponDTO): Promise<Coupon | null> {
    return await this.couponRepository.update(id, { ...data });
  }

  async delete(id: string): Promise<Coupon | null> {
    return await this.couponRepository.softDelete(id);
  }
}
