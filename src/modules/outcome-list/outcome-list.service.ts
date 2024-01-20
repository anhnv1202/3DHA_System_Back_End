import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { OutcomeListsRepository } from './outcome-list.repository';
import { SEARCH_BY } from '@common/constants/global.const';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { OutcomeList } from '@models/outcomeList.model';
import { User } from '@models/user.model';
import { QuizzsRepository } from '@modules/quizz/quizz.repository';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { outcomeListPopulate } from '@common/constants/populate.const';

@Injectable()
export class OutcomeListService {
  constructor(
    private outcomeListsRepository: OutcomeListsRepository,
    private quizzsRepository: QuizzsRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getOne(id: string): Promise<OutcomeList> {
    return await this.outcomeListsRepository.findById(id, outcomeListPopulate);
  }

  async getOneByCurrent(user: User, quizzId: string): Promise<OutcomeList> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const quizz = (await this.quizzsRepository.findById(quizzId)).toObject();
      if (!quizz) throw new BadRequestException('cannot-find-quizz');
      const matchingOutcomeList = quizz.outcomeList.find((outcomeList) => outcomeList.user._id === user._id);
      const outcomeList = await this.outcomeListsRepository.findById(matchingOutcomeList._id);
      if (!outcomeList) throw new BadRequestException('cannot-find-outcomeList');
      await session.commitTransaction();
      return outcomeList;
    } catch (e) {
      await session.abortTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await session.endSession();
    }
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<OutcomeList>> {
    const [data, total] = await this.outcomeListsRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.OUTCOME_LIST,
      populates: outcomeListPopulate,
    });
    return { data, total };
  }
}
