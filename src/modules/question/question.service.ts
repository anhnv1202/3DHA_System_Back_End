import { Injectable } from '@nestjs/common';
import { QuestionsRepository } from './question.repository';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Question } from '@models/question.model';
import { QuestionDTO, UpdateQuestionDTO } from 'src/dto/question.dto';
import { SEARCH_BY } from '@common/constants/global.const';
import { User } from '@models/user.model';

@Injectable()
export class QuestionService {
  constructor(private questionRepository: QuestionsRepository) {}

  async getOne(user:User,id: string): Promise<Question> {
    return await this.questionRepository.findById(id);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Question>> {
    const [data, total] = await this.questionRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.QUESTION,
    });
    return { data, total };
  }

  async create(data: QuestionDTO): Promise<Question | null> {
    return await this.questionRepository.create(data);
  }

  async update(user:User,id: string, data: UpdateQuestionDTO): Promise<Question | null> {
    return await this.questionRepository.update(id, data );
  }

  async delete(user:User,id: string): Promise<Question | null> {
    return await this.questionRepository.softDelete(id);
  }
}
