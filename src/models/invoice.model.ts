import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Bill } from './bill.model';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Invoice extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, unique: true })
  user: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  receipt: number;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Bill', required: true, default: [] })
  bills: PopulatedDoc<Bill, Types.ObjectId>[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

InvoiceSchema.statics = {};
