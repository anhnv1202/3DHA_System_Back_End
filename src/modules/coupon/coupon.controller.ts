import { ResponseType, Roles } from '@common/constants/global.const';
import { Auth } from '@common/decorators/auth.decorator';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { Coupon } from '@models/coupon.model';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CouponDTO, CouponQueryDTO, UpdateCouponDTO } from 'src/dto/coupon.dto';
import { ApiNormalResponse } from './../../common/decorators/api-response/api-normal-response.decorator';
import { ApiPaginationResponse } from './../../common/decorators/api-response/api-pagination-response.decorator';
import { CouponService } from './coupon.service';

@Controller('coupon')
@ApiTags('coupon')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Post('create')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiBody({ type: CouponDTO })
  @ApiNormalResponse({ model: Coupon, type: ResponseType.Ok })
  createCoupon(@Body() body: CouponDTO): Promise<Coupon> {
    return this.couponService.create(body);
  }

  @Get('get-all')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiQuery({ name: 'coupon', type: CouponQueryDTO })
  @ApiPaginationResponse(Coupon)
  getAllCoupon(@GetPagination() pagination: Pagination): Promise<PaginationResult<Coupon>> {
    return this.couponService.getAll(pagination);
  }

  @Get('get/:id')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Coupon, type: ResponseType.Ok })
  getOneCoupon(@Param() body: { id: string }): Promise<Coupon> {
    return this.couponService.getOne(body.id);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateCouponDTO })
  @ApiNormalResponse({ model: Coupon, type: ResponseType.Ok })
  updateCoupon(@Body() body: UpdateCouponDTO, @Param() params: { id: string }) {
    return this.couponService.update(params.id, body);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Coupon, type: ResponseType.Ok })
  deleteCoupon(@Param() params: { id: string }) {
    return this.couponService.delete(params.id);
  }
}
