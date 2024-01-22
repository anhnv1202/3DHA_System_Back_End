import { ResponseType } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Public } from '@common/decorators/common.decorator';
import { Profile } from '@common/decorators/user.decorator';
import { ExcludePasswordInterceptor } from '@interceptors/exclude-password.interceptor';
import { User } from '@models/user.model';
import { Body, Controller, Get, Post, Req, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDTO,
  ConfirmDTO,
  ForgotPasswordDTO,
  LoginDto,
  RegisterDTO,
  SuccessResponseDTO,
} from 'src/dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @Public()
  @ApiBody({ type: LoginDto })
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/login-google')
  @Public()
  @UseGuards(AuthGuard('google'))
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Post('/register')
  @Public()
  @ApiBody({ type: RegisterDTO })
  @ApiNormalResponse({ model: SuccessResponseDTO, type: ResponseType.Ok })
  register(@Body() registerDto: RegisterDTO, @Request() request: Request) {
    return this.authService.register(registerDto, request);
  }

  @Post('/confirm')
  @Public()
  @ApiBody({ type: ConfirmDTO })
  @ApiNormalResponse({ model: SuccessResponseDTO, type: ResponseType.Ok })
  confirm(@Body() confirmDto: ConfirmDTO) {
    return this.authService.confirm(confirmDto.token);
  }

  @Post('/forgot')
  @Public()
  @ApiBody({ type: ForgotPasswordDTO })
  @ApiNormalResponse({ model: SuccessResponseDTO, type: ResponseType.Ok })
  forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO, @Request() request: Request) {
    return this.authService.forgotPassword(forgotPasswordDTO, request);
  }

  @Post('/change-password')
  @Public()
  @ApiBody({ type: ChangePasswordDTO })
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  @UseInterceptors(ExcludePasswordInterceptor)
  changePassword(@Body() body: ChangePasswordDTO, @Profile() user: User) {
    return this.authService.changePassword(body, user);
  }
}
