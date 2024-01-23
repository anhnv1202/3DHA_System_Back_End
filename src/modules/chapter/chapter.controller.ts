import { Auth } from '@common/decorators/auth.decorator';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ChapterService } from './chapter.service';
import { ResponseType, Roles } from '@common/constants/global.const';
import { Chapter } from '@models/chapter.model';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ChapterDTO, ChapterQueryDTO } from 'src/dto/chapter.dto';
import { Public } from '@common/decorators/common.decorator';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { Profile } from '@common/decorators/user.decorator';
import { User } from '@models/user.model';

@Controller('chapter')
@ApiTags('chapter')
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Post('create')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiBody({ type: ChapterDTO })
  @ApiNormalResponse({ model: Chapter, type: ResponseType.Ok })
  createChapter(@Body() body: ChapterDTO): Promise<Chapter> {
    return this.chapterService.create(body);
  }

  @Get('get-all')
  @Public()
  @ApiQuery({ name: 'chapter', type: ChapterQueryDTO })
  @ApiPaginationResponse(Chapter)
  getAllChapter(@GetPagination() pagination: Pagination): Promise<PaginationResult<Chapter>> {
    return this.chapterService.getAll(pagination);
  }

  @Get('get/:id')
  @Public()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Chapter, type: ResponseType.Ok })
  getOneChapter(@Param() body: { id: string }): Promise<Chapter> {
    return this.chapterService.getOne(body.id);
  }

  // @Put('update/:id')
  // @ApiBearerAuth()
  // @Auth([Roles.TEACHER])
  // @ApiParam({ name: 'id', type: String, required: true })
  // @ApiBody({ type: UpdateChapterDTO })
  // @ApiNormalResponse({ model: Chapter, type: ResponseType.Ok })
  // updateChapter(@Body() body: UpdateChapterDTO, @Param() params: { id: string }, @Profile() user: User) {
  //   return this.chapterService.update(user, params.id, body);
  // }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Chapter, type: ResponseType.Ok })
  deleteChapter(@Param() params: { id: string }, @Profile() user: User) {
    return this.chapterService.delete(user, params.id);
  }
}
