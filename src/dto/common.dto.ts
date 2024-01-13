import { SORT_DIRECTION } from '@common/constants/global.const';
import { IsArray, IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty()
  @IsString()
  @IsIn(SORT_DIRECTION)
  @IsOptional()
  sortType?: string;

  @IsOptional()
  @IsString()
  text?: string;
}

export class ChangeActiveDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  listId: string[];
}
