import { IsNotEmpty, IsNumber, IsOptional, IsString } from '@common/validator';
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
}

export class CourseQueryDTO {
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
  @IsString()
  @IsNotEmpty()
  major?: Types.ObjectId;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price?: number;
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
  @IsString()
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
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  quizz?: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  chapters?: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  discount?: Types.ObjectId;
}
