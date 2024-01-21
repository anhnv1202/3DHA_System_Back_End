import { DEFAULT_THUMB_COURSE, Level } from '@common/constants/global.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Major } from './major.models';
import { User } from './user.model';
import { Quizz } from './quizz.model';
import { Chapter } from './chapter.model';
import { Discount } from './discount.model';
import { Rating } from './rating.model';

@Schema({ timestamps: true })
export class Course extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string[];

  @ApiProperty()
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Major' })
  major: PopulatedDoc<Major, Types.ObjectId>;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty()
  @Prop({ required: true })
  level: Level;

  @ApiProperty()
  @Prop({ default: DEFAULT_THUMB_COURSE })
  thumbnail: string;

  @ApiProperty()
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Quizz', required: false, default: [] })
  quizzs: PopulatedDoc<Quizz, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Chapter', default: [] })
  chapters: PopulatedDoc<Chapter, Types.ObjectId>[];

  @ApiProperty()
  @Prop()
  sold: number;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Rating', default: [] })
  ratings: PopulatedDoc<Rating, Types.ObjectId>[];

  @ApiProperty()
  @Prop()
  totalRatings: number;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Discount' })
  discount: PopulatedDoc<Discount, Types.ObjectId>;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.statics = {};
