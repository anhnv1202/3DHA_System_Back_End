import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Course } from './course.models';
import { Lesson } from './lesson.model';
import { Quizz } from './quizz.model';

@Schema({ timestamps: true })
export class Chapter extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Lesson', required: false, default: [] })
  lessons: PopulatedDoc<Lesson, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Quizz', required: false, default: [] })
  quizzs: PopulatedDoc<Quizz, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Course' })
  course: PopulatedDoc<Course, Types.ObjectId>;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

ChapterSchema.statics = {};
