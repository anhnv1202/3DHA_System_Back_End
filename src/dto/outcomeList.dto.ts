import { Question } from '@common/interfaces/outcomeList';
import { IsNotEmpty, IsArray, IsObject, IsMongoId } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class OutcomeListDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  quizzId: string;

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  questions: Question[];
}
