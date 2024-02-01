import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './common.dto';

export class RatingDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  star: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  course: string;
}

export class RatingQueryDTO extends PaginationDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  star?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment?: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  postedBy?: string;
}

export class UpdateRatingDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  star?: number;
}
