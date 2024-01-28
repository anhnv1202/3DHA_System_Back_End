import { SEARCH_BY } from '@common/constants/global.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Bill } from '@models/bill.model';
import { User } from '@models/user.model';
import { Injectable } from '@nestjs/common';
import { BillsRepository } from './bill.repository';

@Injectable()
export class BillService {
  constructor(private billsRepository: BillsRepository) {}

  async getOne(user: User): Promise<Bill[]> {
    return await this.billsRepository.findAll({ user: user._id });
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Bill>> {
    const [data, total] = await this.billsRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.BILL,
    });
    return { data, total };
  }
}
