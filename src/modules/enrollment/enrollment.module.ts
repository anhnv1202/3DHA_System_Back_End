import { Enrollment, EnrollmentSchema } from '@models/enrollment.model';
import { CouponModule } from '@modules/coupon/coupon.module';
import { CourseModule } from '@modules/course/course.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentsRepository } from './enrollment.repository';
import { EnrollmentService } from './enrollment.service';
import { DiscountModule } from '@modules/discount/discount.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    CourseModule,
    UserModule,
    CouponModule,
    DiscountModule
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentsRepository, EnrollmentService],
  exports: [EnrollmentsRepository, EnrollmentService],
})
export class EnrollmentModule {}
