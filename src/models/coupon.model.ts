import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Coupon extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  promotion: number;

  @ApiProperty()
  @Prop()
  expired: Date;

  @ApiProperty()
  @Prop()
  limit: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

CouponSchema.statics = {};
