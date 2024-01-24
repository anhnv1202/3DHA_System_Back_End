import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Chapter } from './chapter.model';
import { Question } from './question.model';

@Schema({ timestamps: true })
export class Quizz extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Question', required: true, default: [] })
  questions: PopulatedDoc<Question, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Chapter' })
  chapter: PopulatedDoc<Chapter, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'OutcomeList', required: true, default: [] })
  outcomeList: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const QuizzSchema = SchemaFactory.createForClass(Quizz);

QuizzSchema.statics = {};
