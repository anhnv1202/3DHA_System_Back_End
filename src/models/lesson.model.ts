import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Chapter } from './chapter.model';

@Schema({ timestamps: true })
export class Lesson extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  title: string;

  @ApiProperty()
  @Prop({})
  video: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: false })
  document: string;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Chapter' })
  chapter: PopulatedDoc<Chapter, Types.ObjectId>;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

LessonSchema.statics = {};
