import { ResponseType, Roles } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { Auth } from '@common/decorators/auth.decorator';
import { Profile } from '@common/decorators/user.decorator';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { Discount } from '@models/discount.model';
import { User } from '@models/user.model';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DiscountDTO, DiscountQueryDTO, UpdateDiscountDTO } from 'src/dto/discount.dto';
import { DiscountService } from './discount.service';

@Controller('discount')
@ApiTags('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Post('create')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiBody({ type: DiscountDTO })
  @ApiNormalResponse({ model: Discount, type: ResponseType.Ok })
  createDiscount(@Body() body: DiscountDTO): Promise<Discount> {
    return this.discountService.create(body);
  }

  @Get('get-all')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiQuery({ name: 'discount', type: DiscountQueryDTO })
  @ApiPaginationResponse(Discount)
  getAllDiscount(@GetPagination() pagination: Pagination): Promise<PaginationResult<Discount>> {
    return this.discountService.getAll(pagination);
  }

  @Get('get/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Discount, type: ResponseType.Ok })
  getOneDiscount(@Param() body: { id: string }): Promise<Discount> {
    return this.discountService.getOne(body.id);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateDiscountDTO })
  @ApiNormalResponse({ model: Discount, type: ResponseType.Ok })
  updateDiscount(@Body() body: UpdateDiscountDTO, @Param() params: { id: string }, @Profile() user: User) {
    return this.discountService.update(user, params.id, body);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Auth([Roles.TEACHER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Discount, type: ResponseType.Ok })
  deleteDiscount(@Param() params: { id: string }, @Profile() user: User) {
    return this.discountService.delete(user, params.id);
  }
}
