import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { OutcomeListService } from './outcome-list.service';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { OutcomeList } from '@models/outcomeList.model';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { ResponseType, Roles } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Profile } from '@common/decorators/user.decorator';
import { User } from '@models/user.model';
import { Auth } from '@common/decorators/auth.decorator';

@Controller('outcome-list')
@ApiTags('outcome-list')
export class OutcomeListController {
  constructor(private outcomeListService: OutcomeListService) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiQuery({ name: 'outcome-list' })
  @ApiPaginationResponse(OutcomeList)
  getAllOutcomeList(@GetPagination() pagination: Pagination): Promise<PaginationResult<OutcomeList>> {
    return this.outcomeListService.getAll(pagination);
  }

  @Get('current/:id')
  @ApiBearerAuth()
  @Auth([Roles.STUDENT])
  @ApiParam({ name: 'quizzId', type: String, required: true })
  @ApiNormalResponse({ model: OutcomeList, type: ResponseType.Ok })
  getCurrentOutcomeList(@Param() body: { quizzId: string }, @Profile() user: User): Promise<OutcomeList> {
    return this.outcomeListService.getOneByCurrent(user, body.quizzId);
  }

  @Get('get/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: OutcomeList, type: ResponseType.Ok })
  getOneOutcomeList(@Param() body: { id: string }): Promise<OutcomeList> {
    return this.outcomeListService.getOne(body.id);
  }
}
