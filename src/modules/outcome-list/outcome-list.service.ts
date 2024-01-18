import { Injectable } from '@nestjs/common';
import { OutcomeListsRepository } from './outcome-list.repository';
import { SEARCH_BY } from '@common/constants/global.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { OutcomeList } from '@models/outcomeList.model';
import { User } from '@models/user.model';
import { QuizzsRepository } from '@modules/quizz/quizz.repository';

@Injectable()
export class OutcomeListService {
  constructor(
    private outcomeListsRepository: OutcomeListsRepository,
    private quizzsRepository: QuizzsRepository,
  ) {}

  async getOne(id: string): Promise<OutcomeList> {
    return await this.outcomeListsRepository.findById(id);
  }

  async getOneByCurrent(user: User, quizzId: string): Promise<OutcomeList> {
    const quizz = (await this.quizzsRepository.findById(quizzId)).toObject();
    const outcomeList = quizz.outcomeList;
    const matchingOutcomeList = outcomeList.find((outcomeList) => outcomeList.user._id === user._id);
    return await this.outcomeListsRepository.findById(matchingOutcomeList._id);
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
