import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Token extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  token: string;

  @ApiProperty()
  @Prop()
  expire: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.statics = {};
