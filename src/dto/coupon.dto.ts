import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './common.dto';

export class CouponDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  promotion: number;
}

export class CouponQueryDTO extends PaginationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

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

export class UpdateCouponDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

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
