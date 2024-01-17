import { IsNotEmpty, IsNumber, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class OutcomeDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quizzId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberQuestion: number;
}

export class SubmitDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quizzId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberQuestion: number;
}