import { Question } from '@common/interfaces/outcomeList';
import { IsNotEmpty, IsString, IsArray, IsObject } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class OutcomeListDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quizzId: string;

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  questions: Question[];
}
