import { Option } from '@common/constants/global.const';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './common.dto';

export class QuizzDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  chapter: string;
}

export class QuizzQueryDTO extends PaginationDTO {
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
  chapter?: string;
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
