import { Coupon, CouponSchema } from '@models/coupon.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponController } from './coupon.controller';
import { CouponsRepository } from './coupon.repository';
import { CouponService } from './coupon.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])],
  controllers: [CouponController],
  providers: [CouponsRepository, CouponService],
  exports: [CouponsRepository, CouponService],
})
export class CouponModule {}
