import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { Auth } from '@common/decorators/auth.decorator';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ResponseType, Roles } from '@common/constants/global.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { Public } from '@common/decorators/common.decorator';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { CourseDTO, UpdateCourseDTO } from 'src/dto/course.dto';
import { Course } from '@models/course.models';
import { Profile } from '@common/decorators/user.decorator';
import { User } from '@models/user.model';

@Controller('course')
@ApiTags('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post('create')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiBody({ type: CourseDTO })
  @ApiNormalResponse({ model: Course, type: ResponseType.Ok })
  createCourse(@Body() body: CourseDTO, @Profile() user: User): Promise<Course> {
    return this.courseService.create(user, body);
  }

  @Get('get-all')
  @Public()
  @ApiQuery({ name: 'user', type: CourseDTO })
  @ApiPaginationResponse(Course)
  getAllCourse(@GetPagination() pagination: Pagination): Promise<PaginationResult<Course>> {
    return this.courseService.getAll(pagination);
  }

  @Get('get/:id')
  @Public()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Course, type: ResponseType.Ok })
  getOneCourse(@Param() body: { id: string }): Promise<Course> {
    return this.courseService.getOne(body.id);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateCourseDTO })
  @ApiNormalResponse({ model: Course, type: ResponseType.Ok })
  updateCourse(@Body() body: UpdateCourseDTO, @Param() params: { id: string }, @Profile() user: User) {
    return this.courseService.update(user, params.id, body);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Course, type: ResponseType.Ok })
  deleteCourse(@Param() params: { id: string }, @Profile() user: User) {
    return this.courseService.delete(user, params.id);
  }
}
