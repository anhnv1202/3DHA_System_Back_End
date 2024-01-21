import { IsNotEmpty, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ChapterDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course: Types.ObjectId;
}

export class ChapterQueryDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}

export class UpdateChapterDTO {
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
  lesson?: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  course?: Types.ObjectId;
}
