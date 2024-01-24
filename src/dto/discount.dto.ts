import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './common.dto';

export class DiscountDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  promotion: number;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  course: string;
}

export class DiscountQueryDTO extends PaginationDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  promotion?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  expired?: Date;
}

export class UpdateDiscountDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  promotion?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  expired?: Date;
}
