import { ResponseType } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Public } from '@common/decorators/common.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterDTO, RegisterResponseDTO } from 'src/dto/auth.dto';
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
  @ApiBody({ type: RegisterDTO })
  @ApiNormalResponse({ model: RegisterResponseDTO, type: ResponseType.Ok })
  login(@Body() loginDto: RegisterDTO) {
    return this.authService.register(loginDto);
  }
}
