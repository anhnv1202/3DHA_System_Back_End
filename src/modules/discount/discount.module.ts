import { Discount, DiscountSchema } from '@models/discount.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountController } from './discount.controller';
import { DiscountsRepository } from './discount.repository';
import { DiscountService } from './discount.service';
import { CourseModule } from '@modules/course/course.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }]),CourseModule],
  controllers: [ DiscountController],
  providers: [DiscountsRepository, DiscountService],
  exports: [DiscountsRepository, DiscountService],
})
export class DiscountModule {}
