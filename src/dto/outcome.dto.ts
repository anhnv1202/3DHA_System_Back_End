import { IsNotEmpty, IsNumber, IsMongoId } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class OutcomeDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  quizzId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberQuestion: number;
}

export class SubmitDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  quizzId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberQuestion: number;
}
