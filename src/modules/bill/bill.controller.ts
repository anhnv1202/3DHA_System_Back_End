import { ResponseType, Roles } from '@common/constants/global.const';
import { Auth } from '@common/decorators/auth.decorator';
import { Profile } from '@common/decorators/user.decorator';
import { Pagination } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { Bill } from '@models/bill.model';
import { User } from '@models/user.model';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BillQueryDTO } from 'src/dto/bill.dto';
import { ApiNormalResponse } from './../../common/decorators/api-response/api-normal-response.decorator';
import { ApiPaginationResponse } from './../../common/decorators/api-response/api-pagination-response.decorator';
import { PaginationResult } from './../../common/interfaces/filter.interface';
import { BillService } from './bill.service';

@Controller('bill')
@ApiTags('bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiQuery({ name: 'bill', type: BillQueryDTO })
  @ApiPaginationResponse(Bill)
  getAllBill(@GetPagination() pagination: Pagination): Promise<PaginationResult<Bill>> {
    return this.billService.getAll(pagination);
  }

  @Get('get')
  @ApiBearerAuth()
  @ApiNormalResponse({ model: Bill, type: ResponseType.Ok })
  getOneBill(@Profile() user: User): Promise<Bill[]> {
    return this.billService.getOne(user);
  }
}
