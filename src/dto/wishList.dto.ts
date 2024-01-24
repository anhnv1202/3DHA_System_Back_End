import { IsNotEmpty, IsNumber, IsMongoId } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { Option } from '@common/constants/global.const';

export class WishListDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  option: Option;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  course: string;
}
