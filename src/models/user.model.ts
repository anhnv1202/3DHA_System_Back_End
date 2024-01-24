import { DEFAULT_AVATAR, Roles } from '@common/constants/global.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Course } from './course.models';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty()
  @Prop({ required: true })
  lastName: string;

  @ApiProperty()
  @Prop({ required: true })
  firstName: string;

  @ApiProperty()
  @Prop({ required: false })
  name: string;

  @ApiProperty()
  @Prop({ required: false, unique: true })
  phone: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @ApiProperty()
  @Prop({ default: DEFAULT_AVATAR })
  avatar: string;

  @ApiProperty()
  @Prop({ required: false, default: Roles.STUDENT })
  role: Roles;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Course', required: false, default: [] })
  wishList: PopulatedDoc<Course, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Course', required: false, default: [] })
  courseList: PopulatedDoc<Course, Types.ObjectId>[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @ApiProperty()
  @Prop({ required: false })
  bio: string;

  @ApiProperty()
  @Prop({ default: false })
  status: boolean;

  isValidPassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next: NextFunction) {
  try {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if ('password' in update && typeof update === 'object') {
    const password = update.password;
    if (password) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      update.password = hash;
    }
  }
  next();
});

UserSchema.methods.isValidPassword = async function (password: string) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

UserSchema.statics = {};
