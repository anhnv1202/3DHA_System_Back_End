import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Rating extends Document {
  @ApiProperty()
  @Prop()
  star: number;

  @ApiProperty()
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  postedBy: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop()
  comment: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

RatingSchema.statics = {};
