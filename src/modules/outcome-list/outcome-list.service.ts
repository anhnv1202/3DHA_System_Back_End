import { Injectable } from '@nestjs/common';
import { OutcomeListsRepository } from './outcome-list.repository';
import { SEARCH_BY } from '@common/constants/global.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { OutcomeList } from '@models/outcomeList.model';
import { User } from '@models/user.model';

@Injectable()
export class OutcomeListService {
  constructor(private outcomeListsRepository: OutcomeListsRepository) {}

  async getOne(id: string): Promise<OutcomeList> {
    return await this.outcomeListsRepository.findById(id);
  }

  async getOneByCurrent(user: User): Promise<OutcomeList> {
    return await this.outcomeListsRepository.findOne({ 'user._id': user._id });
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<OutcomeList>> {
    const [data, total] = await this.outcomeListsRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.OUTCOME_LIST,
      populates: [{ path: 'user' }, { path: 'outcomeList' }],
    });
    return { data, total };
  }
}
