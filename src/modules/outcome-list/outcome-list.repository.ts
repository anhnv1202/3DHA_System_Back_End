import { OutcomeList } from '@models/outcomeList.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class OutcomeListsRepository extends BaseRepository<OutcomeList> {
  constructor(@InjectModel(OutcomeList.name) outcomeListModel: Model<OutcomeList>) {
    super(outcomeListModel);
  }
}
