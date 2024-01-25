import { Payment } from '@common/constants/global.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Coupon } from './coupon.model';
import { Course } from './course.models';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Enrollment extends Document {
  @ApiProperty()
  @Prop({ required: true, type: [SchemaTypes.ObjectId], ref: 'Course' })
  courseList: PopulatedDoc<Course, Types.ObjectId>;

  @ApiProperty()
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  orderBy: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Coupon' })
  coupon: PopulatedDoc<Coupon, Types.ObjectId>;

  @ApiProperty()
  @Prop({ required: true })
  totalPrice: number;

  @ApiProperty()
  @Prop({ required: true, default: Payment.PROCESSING })
  status: Payment;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

EnrollmentSchema.statics = {};
