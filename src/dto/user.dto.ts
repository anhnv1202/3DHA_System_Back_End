import { REGEX, ROLE_ARRAY, ROLE_NORMAL, Roles } from '@common/constants/global.const';
import { IsBoolean, IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, Matches } from '@common/validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { PaginationDTO } from './common.dto';
export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Matches(REGEX.PHONE_NUMBER)
  phone?: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsEnum(Roles)
  @IsIn(ROLE_NORMAL)
  @IsNotEmpty()
  @IsOptional()
  role?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bio?: string;
}

export class UserQueryDTO extends PaginationDTO {
  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  deletedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  status?: string;

  @ApiProperty()
  @IsEnum(Roles)
  @IsNotEmpty()
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
