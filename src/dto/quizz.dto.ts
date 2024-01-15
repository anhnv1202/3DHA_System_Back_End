import { IsNotEmpty, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class QuizzDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course: Types.ObjectId;
}

export class QuizzQueryDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}

export class UpdateQuizzDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  question?: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  course?: Types.ObjectId;
}
