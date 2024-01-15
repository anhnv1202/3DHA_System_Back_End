import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Question } from './question.model';
import { Course } from './course.models';

@Schema({ timestamps: true })
export class Quizz extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: Question.name })
  questions: PopulatedDoc<Question, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: Question.name })
  course: PopulatedDoc<Course, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: Types.ObjectId })
  outcomeList: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const QuizzSchema = SchemaFactory.createForClass(Quizz);

QuizzSchema.statics = {};
