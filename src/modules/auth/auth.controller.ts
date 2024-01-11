import { ResponseType } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Public } from '@common/decorators/common.decorator';
import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ConfirmDTO, RegisterDTO, SuccessResponseDTO } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
// import { LoginDto, LoginUserDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   @Post('/login')
  //   @Public()
  //   @ApiBody({ type: LoginDto })
  //   @ApiNormalResponse({ model: LoginUserDto, type: ResponseType.Ok })
  //   login(@Body() loginDto: LoginDto) {
  //     return this.authService.login(loginDto);
  //   }

  @Post('/register')
  @Public()
  @ApiNormalResponse({ model: SuccessResponseDTO, type: ResponseType.Ok })
  register(@Body() loginDto: RegisterDTO, @Request() request: Request) {
    return this.authService.register(loginDto, request);
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
  @ApiBody({ type: ConfirmDTO })
  @ApiNormalResponse({ model: SuccessResponseDTO, type: ResponseType.Ok })
  forgotPassword;
}
