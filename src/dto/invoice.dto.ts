import { IsNotEmpty, IsNumber, IsOptional } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { PaginationDTO } from './common.dto';

export class InvoiceQueryDTO extends PaginationDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  user?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  receipt?: number;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  bills?: number;
}
