import { ApiNormalResponse } from '@common/decorators/api-response';
import { Auth } from '@common/decorators/auth.decorator';
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { ResponseType, Roles } from '@common/constants/global.const';
import { QuestionDTO, QuestionQueryDTO, UpdateQuestionDTO } from 'src/dto/question.dto';
import { Question } from '@models/question.model';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { GetPagination } from '@common/interfaces/pagination-request';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { QuestionService } from './question.service';
import { Profile } from '@common/decorators/user.decorator';
import { User } from '@models/user.model';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post('create')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiBody({ type: QuestionDTO })
  @ApiNormalResponse({ model: Question, type: ResponseType.Ok })
  createMajor(@Body() body: QuestionDTO, @Profile() user: User) {
    return this.questionService.create(user, body);
  }

  @Get('get-all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'question', type: QuestionQueryDTO })
  @ApiPaginationResponse(Question)
  getAllMajor(@GetPagination() pagination: Pagination): Promise<PaginationResult<Question>> {
    return this.questionService.getAll(pagination);
  }

  @Get('get/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Question, type: ResponseType.Ok })
  getOneMajor(@Param() body: { id: string }, @Profile() user: User): Promise<Question> {
    return this.questionService.getOne(user, body.id);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateQuestionDTO })
  @ApiNormalResponse({ model: Question, type: ResponseType.Ok })
  updateMajor(@Body() body: UpdateQuestionDTO, @Param() params: { id: string }, @Profile() user: User) {
    return this.questionService.update(user, params.id, body);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Question, type: ResponseType.Ok })
  deleteMajor(@Param() params: { id: string }, @Profile() user: User) {
    return this.questionService.delete(user, params.id);
  }
}
