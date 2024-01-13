import { REGEX, ROLE_ARRAY, ROLE_NORMAL, Roles } from '@common/constants/global.const';
import { IsBoolean, IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, Matches } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { PaginationDTO } from './common.dto';
export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PHONE_NUMBER)
  phone: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsEnum(Roles)
  @IsIn(ROLE_NORMAL)
  @IsNotEmpty()
  role: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bio: string;
}

export class UserQueryDTO extends PaginationDTO {
  @ApiProperty()
  @IsDate()
  @IsOptional()
  deletedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: string;

  @ApiProperty()
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;
}

export class ChangeRoleUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Roles)
  @IsIn(ROLE_ARRAY)
  role: Roles;
}
