import { Enrollment, EnrollmentSchema } from '@models/enrollment.model';
import { BillModule } from '@modules/bill/bill.module';
import { CouponModule } from '@modules/coupon/coupon.module';
import { CourseModule } from '@modules/course/course.module';
import { DiscountModule } from '@modules/discount/discount.module';
import { InvoiceModule } from '@modules/invoice/invoice.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentsRepository } from './enrollment.repository';
import { EnrollmentService } from './enrollment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    CourseModule,
    UserModule,
    CouponModule,
    DiscountModule,
    BillModule,
    InvoiceModule,
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentsRepository, EnrollmentService],
  exports: [EnrollmentsRepository, EnrollmentService],
})
export class EnrollmentModule {}
