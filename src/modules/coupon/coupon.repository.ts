import { Coupon } from '@models/coupon.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class CouponsRepository extends BaseRepository<Coupon> {
  constructor(@InjectModel(Coupon.name) couponModel: Model<Coupon>) {
    super(couponModel);
  }
}
