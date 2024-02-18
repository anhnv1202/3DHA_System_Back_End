import { DEFAULT_THUMB_COURSE } from '@common/constants/global.const';
import { LikeStatus } from '@common/interfaces/likeStatus';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Chapter } from './chapter.model';
import { Discount } from './discount.model';
import { Major } from './major.models';
import { Rating } from './rating.model';
import { User } from './user.model';

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
  @Prop({ default: DEFAULT_THUMB_COURSE })
  thumbnail: string;

  @ApiProperty()
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Chapter', default: [] })
  chapters: PopulatedDoc<Chapter, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ default: 0 })
  sold: number;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Rating', default: [] })
  ratings: PopulatedDoc<Rating, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ type: Number, default: 0 })
  totalRatings: number;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Discount' })
  discount: PopulatedDoc<Discount, Types.ObjectId>;

  @ApiProperty()
  @Prop({
    type: [
      {
        user: { type: SchemaTypes.ObjectId, ref: 'User' },
        status: { type: Boolean },
      },
    ],
    ref: 'User',
    required: false,
    default: [],
  })
  likeInfo: LikeStatus[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.statics = {};
