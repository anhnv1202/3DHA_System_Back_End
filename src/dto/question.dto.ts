import { Answer } from '@common/constants/global.const';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  detail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answerA: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answerB: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answerC: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answerD: string;

  @ApiProperty()
  @IsEnum(Answer)
  @IsNotEmpty()
  outcome: Answer;
}

export class QuestionQueryDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  detail?: string;
}

export class UpdateQuestionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  detail?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  answerA?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  answerB?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  answerC?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  answerD?: string;

  @ApiProperty()
  @IsEnum(Answer)
  @IsNotEmpty()
  @IsOptional()
  outcome?: Answer;
}
