import { IsNotEmpty, IsNumber, IsString } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { Option } from '@common/constants/global.const';

export class WishListDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  option: Option;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course: string;
}
