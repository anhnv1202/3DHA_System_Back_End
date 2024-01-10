import { TokenType } from '@common/constants/global.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Token extends Document {
  @ApiProperty()
  @Prop()
  tokenType: TokenType;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  token: string;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  createdBy: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop()
  expire: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.statics = {};
