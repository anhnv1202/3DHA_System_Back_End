import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { Public } from '@common/decorators/common.decorator';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Auth } from '@common/decorators/auth.decorator';
import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ResponseType, Roles } from '@common/constants/global.const';
import { QuizzDTO, QuizzQueryDTO, UpdateQuizzDTO } from 'src/dto/quizz.dto';
import { Quizz } from '@models/quizz.model';
import { Profile } from '@common/decorators/user.decorator';
import { User } from '@models/user.model';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';

@Controller('quizz')
@ApiTags('quizz')
export class QuizzController {
  constructor(private quizzService: QuizzService) {}

  @Post('create')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiBody({ type: QuizzDTO })
  @ApiNormalResponse({ model: Quizz, type: ResponseType.Ok })
  createQuizz(@Body() body: QuizzDTO): Promise<Quizz> {
    return this.quizzService.create(body);
  }

  @Get('get-all')
  @Public()
  @ApiQuery({ name: 'quizz', type: QuizzQueryDTO })
  @ApiPaginationResponse(Quizz)
  getAllQuizz(@GetPagination() pagination: Pagination): Promise<PaginationResult<Quizz>> {
    return this.quizzService.getAll(pagination);
  }

  @Get('get/:id')
  @Public()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Quizz, type: ResponseType.Ok })
  getOneQuizz(@Param() body: { id: string }): Promise<Quizz> {
    return this.quizzService.getOne(body.id);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateQuizzDTO })
  @ApiNormalResponse({ model: Quizz, type: ResponseType.Ok })
  updateQuizz(@Body() body: UpdateQuizzDTO, @Param() params: { id: string }, @Profile() user: User) {
    return this.quizzService.update(user, params.id, body);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Quizz, type: ResponseType.Ok })
  deleteQuizz(@Param() params: { id: string }, @Profile() user: User) {
    return this.quizzService.delete(user, params.id);
  }
}
