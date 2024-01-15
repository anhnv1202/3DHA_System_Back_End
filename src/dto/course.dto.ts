import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CourseDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  major: Types.ObjectId;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // thumbnail: string;

  // @ApiProperty()
  // @IsObject()
  // @IsNotEmpty()
  // quizzs: Types.ObjectId[];

  // @ApiProperty()
  // @IsObject()
  // @IsNotEmpty()
  // chapters: Types.ObjectId[];
}

export class UpdateCourseDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  major?: Types.ObjectId;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  quizzs?: Types.ObjectId[];

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  chapters?: Types.ObjectId[];

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  discount?: Types.ObjectId;
}
