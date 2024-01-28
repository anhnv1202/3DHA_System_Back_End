import { SEARCH_BY } from '@common/constants/global.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Invoice } from '@models/invoice.model';
import { User } from '@models/user.model';
import { Injectable } from '@nestjs/common';
import { InvoicesRepository } from './invoice.repository';

@Injectable()
export class InvoiceService {
  constructor(private invoiceRepository: InvoicesRepository) {}

  async getOne(user: User): Promise<Invoice> {
    return await this.invoiceRepository.findOne({ user: user._id });
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Invoice>> {
    const [data, total] = await this.invoiceRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.INVOICE,
    });
    return { data, total };
  }
}
