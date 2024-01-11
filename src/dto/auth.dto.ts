import { IsEmail, IsNotEmpty, IsOptional, IsString } from '@common/validator';
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
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
