import { Injectable } from '@nestjs/common';
import { MajorsRepository } from './major.repository';
import { Major } from '@models/major.models';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { SEARCH_BY } from '@common/constants/global.const';
import { MajorDTO, UpdateMajorDTO } from 'src/dto/major.dto';

@Injectable()
export class MajorService {
  constructor(private majorRepository: MajorsRepository) {}

  async getOne(id: string): Promise<Major> {
    return await this.majorRepository.findById(id);
  }

  async getAll(pagination: Pagination): Promise<PaginationResult<Major>> {
    const [data, total] = await this.majorRepository.paginate({
      pagination,
      searchBy: SEARCH_BY.MAJOR,

    });
    return { data, total };
  }

  async create(data: MajorDTO): Promise<Major | null> {
    return await this.majorRepository.create({ ...data });
  }

  async update(id: string, data: UpdateMajorDTO): Promise<Major | null> {
    return await this.majorRepository.update(id, { ...data });
  }

  async delete(id: string): Promise<Major | null> {
    return await this.majorRepository.softDelete(id);
  }

}
