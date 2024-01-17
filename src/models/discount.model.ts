import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Discount extends Document {
  @ApiProperty()
  @Prop({ required: true })
  discount: number;

  @ApiProperty()
  @Prop({ required: true})
  expired: Date;

  @ApiProperty()
  @Prop()
  limit: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);

DiscountSchema.statics = {};
