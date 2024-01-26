import { Option } from '@common/constants/global.const';
import { IsMongoId, IsNotEmpty, IsNumber } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';

export class WishlistDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  option: Option;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  course: string;
}

export class LaterListDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  course: string;
}

