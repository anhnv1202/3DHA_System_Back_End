import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Outcome } from './outcome.model';
import { Quizz } from './quizz.model';
import { User } from './user.model';

@Schema({ timestamps: true })
export class OutcomeList extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Quizz', required: true })
  quizz: PopulatedDoc<Quizz, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Outcome', required: true, default: [] })
  outcome: PopulatedDoc<Outcome, Types.ObjectId>;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const OutcomeListSchema = SchemaFactory.createForClass(OutcomeList);

OutcomeListSchema.statics = {};
