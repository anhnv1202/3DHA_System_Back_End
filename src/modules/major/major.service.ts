import { Injectable } from '@nestjs/common';
import { MajorsRepository } from './major.repository';
import { Major } from '@models/major.models';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';

@Injectable()
export class MajorService {
  constructor(private majorRepository: MajorsRepository) {}

  async getOne(id: string): Promise<Major> {
    return await this.majorRepository.findById(id);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Major>> {
    const [data, total] = await this.majorRepository.paginate({
      pagination
    });
    return { data, total };
  }

  async createOne(data: Partial<Major>): Promise<Major | null> {
    return await this.majorRepository.create({ ...data });
  }

  async updateOneBy(id: string, data: Partial<Major>): Promise<Major | null> {
    return await this.majorRepository.update(id, { ...data });
  }

  async deleteOneBy(id: string): Promise<Major | null> {
    return await this.majorRepository.remove(id);
  }
}
