import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { Option } from '@common/constants/global.const';

export class QuizzDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  course: string;
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
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  course?: string;
}

export class UpdateQuestionInQuizzDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  option: Option;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  question: string;
}
