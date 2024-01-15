import { IsNotEmpty, IsOptional, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class MajorDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class MajorQueryDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;
}

export class UpdateMajorDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
