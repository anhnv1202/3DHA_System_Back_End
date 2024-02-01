import { IsMongoId, IsNotEmpty, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './common.dto';

export class LessonDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  chapter: string;
}

export class LessonQueryDTO extends PaginationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;
}

export class UpdateLessonDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  chapter?: string;
}
