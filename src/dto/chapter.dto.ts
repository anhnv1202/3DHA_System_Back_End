import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { Option } from '@common/constants/global.const';
import { PaginationDTO } from './common.dto';

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
  @IsMongoId()
  @IsNotEmpty()
  course: string;
}

export class ChapterQueryDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;
}

export class UpdateChapterDTO extends PaginationDTO{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  course?: string;
}

export class UpdateLessonInChapterDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  option: Option;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  lesson: string;
}
