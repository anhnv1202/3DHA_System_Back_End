import { DEFAULT_THUMB_COURSE } from '@common/constants/global.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string[];

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId })
  major: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty()
  @Prop({ default: DEFAULT_THUMB_COURSE })
  thumbnail: string;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId })
  author: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId })
  quizzs: Types.ObjectId[];

  @ApiProperty()
  @Prop({ type: Types.ObjectId })
  chapters: Types.ObjectId[];

  @ApiProperty()
  @Prop()
  sold: number;

  @ApiProperty()
  @Prop()
  ratings: Types.ObjectId;

  @ApiProperty()
  @Prop()
  totalRatings: number;

  @ApiProperty()
  @Prop({ type: Types.ObjectId })
  discount: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.statics = {};
