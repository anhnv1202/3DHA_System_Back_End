import { Payment } from '@common/constants/global.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { CourseList } from './../common/interfaces/courseList';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Enrollment extends Document {
  @ApiProperty()
  @Prop({
    type: [
      {
        name: { type: String },
        price: { type: Number },
        discount: { type: Number, default: 0 },
        lastPrice: { type: Number },
        author: { type: SchemaTypes.ObjectId, ref: 'User' },
      },
    ],
    ref: 'Course',
    required: false,
  })
  courseList: CourseList[];

  @ApiProperty()
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  orderBy: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: Number })
  coupon: number;

  @ApiProperty()
  @Prop({ required: true })
  totalPrice: number;

  @ApiProperty()
  @Prop({ required: true })
  lastPrice: number;

  @ApiProperty()
  @Prop({ required: true, default: Payment.PROCESSING })
  status: Payment;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

EnrollmentSchema.statics = {};
