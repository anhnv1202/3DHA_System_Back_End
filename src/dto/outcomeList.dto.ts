import { Question } from '@common/interfaces/outcomeList';
import { IsNotEmpty, IsString, IsArray, IsObject } from '@common/validator';

import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class OutcomeListDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quizzId: Types.ObjectId;

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  questions: Question[];
}
