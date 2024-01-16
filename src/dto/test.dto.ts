import { IsNotEmpty, IsNumber, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quizzId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberQuestion: number;
}