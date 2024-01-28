import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Bill extends Document {
  @ApiProperty()
  @Prop({ type: String, required: true })
  course: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  authorReceipt: number;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  adminReceipt: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const BillSchema = SchemaFactory.createForClass(Bill);

BillSchema.statics = {};
