import { IsNotEmpty, IsNumber, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from './common.dto';

export class BillQueryDTO extends PaginationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  course?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  authorReceipt?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  adminReceipt?: number;
}
