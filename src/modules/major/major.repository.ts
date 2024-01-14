import { Major } from '@models/major.models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class MajorsRepository extends BaseRepository<Major> {
  constructor(@InjectModel(Major.name) majorModel: Model<Major>) {
    super(majorModel);
  }
}
