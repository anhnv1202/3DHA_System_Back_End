import { IsMongoId, IsNotEmpty, IsNumber } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  coupon: string;
}

export class UpdateEnrollmentDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
