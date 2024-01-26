import { ResponseType, Roles } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Profile } from '@common/decorators/user.decorator';
import { Enrollment } from '@models/enrollment.model';
import { User } from '@models/user.model';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiPaginationResponse } from './../../common/decorators/api-response/api-pagination-response.decorator';
import { UpdateEnrollmentDTO } from './../../dto/enrollment.dto';
// import { EnrollmentDTO } from 'src/dto/enrollment.dto';
import { Auth } from '@common/decorators/auth.decorator';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { EnrollmentQueryDTO } from 'src/dto/enrollment.dto';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
@ApiTags('enrollment')
export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiQuery({ name: 'enrollment', type: EnrollmentQueryDTO })
  @ApiPaginationResponse(Enrollment)
  getAllEnrollment(@GetPagination() pagination: Pagination): Promise<PaginationResult<Enrollment>> {
    return this.enrollmentService.getAll(pagination);
  }

  @Get('get')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Enrollment, type: ResponseType.Ok })
  getOneEnrollment(@Profile() user: User) {
    return this.enrollmentService.getCurrent(user);
  }

  @Post('create')
  @ApiBearerAuth()
  @ApiNormalResponse({ model: Enrollment, type: ResponseType.Ok })
  createEnrollment(@Body() body, @Profile() user: User) {
    return this.enrollmentService.create(user, body);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateEnrollmentDTO })
  @ApiNormalResponse({ model: Enrollment, type: ResponseType.Ok })
  updateEnrollment(@Body() body: UpdateEnrollmentDTO, @Param() params: { id: string }, @Profile() user: User) {
    return this.enrollmentService.update(user, params.id, body);
  }
}
