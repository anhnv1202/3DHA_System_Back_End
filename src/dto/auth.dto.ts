import { REGEX } from '@common/constants/global.const';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from '@common/validator';
import { User } from '@models/user.model';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.USERNAME)
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PHONE_NUMBER)
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PASSWORD)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PASSWORD)
  rePassword: string;
}

export class SuccessResponseDTO {
  @ApiProperty()
  status: boolean;
}

export class LoginResponseDTO {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;
}
export class ChangePasswordDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PASSWORD)
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PASSWORD)
  confirmPassword: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  token: string;
}

export class ConfirmDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class LoginDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
