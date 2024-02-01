import { ResponseType, Roles } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { Auth } from '@common/decorators/auth.decorator';
import { Public } from '@common/decorators/common.decorator';
import { Profile } from '@common/decorators/user.decorator';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { Course } from '@models/course.models';
import { User } from '@models/user.model';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CourseDTO, CourseQueryDTO, UpdateCourseDTO, UpdateLikeInCourseDTO } from 'src/dto/course.dto';
import { UpdateChapterInCourseDTO } from './../../dto/course.dto';
import { CourseService } from './course.service';

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
  @ApiQuery({ name: 'course', type: CourseQueryDTO })
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

  @Put('update-chapter/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateChapterInCourseDTO })
  @ApiNormalResponse({ model: Course, type: ResponseType.Ok })
  updateChapterInCourse(
    @Body() body: UpdateChapterInCourseDTO,
    @Param() params: { id: string },
    @Profile() user: User,
  ) {
    return this.courseService.updateChapter(user, params.id, body);
  }

  @Put('update-like/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateLikeInCourseDTO })
  @ApiNormalResponse({ model: Course, type: ResponseType.Ok })
  updateLikeInCourse(@Body() body: UpdateLikeInCourseDTO, @Param() params: { id: string }, @Profile() user: User) {
    return this.courseService.updateLike(user, params.id, body);
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
