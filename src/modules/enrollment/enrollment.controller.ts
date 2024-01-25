import { ResponseType } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Profile } from '@common/decorators/user.decorator';
import { Enrollment } from '@models/enrollment.model';
import { User } from '@models/user.model';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { EnrollmentDTO } from 'src/dto/enrollment.dto';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
@ApiTags('enrollment')
export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}
  @Post('get')
  @ApiBearerAuth()
  @ApiNormalResponse({ model: Enrollment, type: ResponseType.Ok })
  getUser(@Body() body, @Profile() user: User) {
    return this.enrollmentService.update(user, body);
  }
}
