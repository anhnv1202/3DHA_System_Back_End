import { IsMongoId, IsNotEmpty, IsNumber } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDTO } from './common.dto';

export class EnrollmentDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  coupon?: string;
}

export class UpdateEnrollmentDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  status: number;
}

export class EnrollmentQueryDTO extends PaginationDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  course?: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  orderBy?: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  coupon?: string;
}
