import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chapter extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId })
  lessons: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

ChapterSchema.statics = {};
