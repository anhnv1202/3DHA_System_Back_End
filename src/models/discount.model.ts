import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Course } from './course.models';

@Schema({ timestamps: true })
export class Discount extends Document {
  @ApiProperty()
  @Prop({ required: true })
  promotion: number;

  @ApiProperty()
  @Prop()
  expired: Date;

  @ApiProperty()
  @Prop()
  limit: number;

  @ApiProperty()
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Course' })
  course: PopulatedDoc<Course, Types.ObjectId>;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);

DiscountSchema.statics = {};
