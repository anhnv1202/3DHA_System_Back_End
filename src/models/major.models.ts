import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Major extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const MajorSchema = SchemaFactory.createForClass(Major);

MajorSchema.statics = {};
