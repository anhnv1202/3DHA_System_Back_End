import { Answer } from '@common/constants/global.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Question extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  detail: string;

  @ApiProperty()
  @Prop({ required: true })
  answerA: string;

  @ApiProperty()
  @Prop({ required: true })
  answerB: string;

  @ApiProperty()
  @Prop({ required: true })
  answerC: string;

  @ApiProperty()
  @Prop({ required: true })
  answerD: string;

  @ApiProperty()
  @Prop({ required: true })
  outcome: Answer;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.statics = {};
