import { ResponseType, Roles } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { Auth } from '@common/decorators/auth.decorator';
import { Profile } from '@common/decorators/user.decorator';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { Invoice } from '@models/invoice.model';
import { User } from '@models/user.model';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InvoiceQueryDTO } from 'src/dto/invoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
@ApiTags('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiQuery({ name: 'invoice', type: InvoiceQueryDTO })
  @ApiPaginationResponse(Invoice)
  getAllBill(@GetPagination() pagination: Pagination): Promise<PaginationResult<Invoice>> {
    return this.invoiceService.getAll(pagination);
  }

  @Get('get')
  @ApiBearerAuth()
  @ApiNormalResponse({ model: Invoice, type: ResponseType.Ok })
  getOneBill(@Profile() user: User): Promise<Invoice> {
    return this.invoiceService.getOne(user);
  }
}
