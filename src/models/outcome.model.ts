import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Outcome extends Document {
  @ApiProperty()
  @Prop({ required: true })
  numberQuestion: number;

  @ApiProperty()
  @Prop({ required: true })
  noAnswers: number;

  @ApiProperty()
  @Prop({ required: true })
  wrongAnswers: number;

  @ApiProperty()
  @Prop({ required: true })
  score: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const OutcomeSchema = SchemaFactory.createForClass(Outcome);

OutcomeSchema.statics = {};
