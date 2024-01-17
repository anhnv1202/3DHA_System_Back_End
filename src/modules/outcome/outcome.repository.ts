import { Outcome } from '@models/outcome.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class OutcomesRepository extends BaseRepository<Outcome> {
  constructor(@InjectModel(Outcome.name) outcomeModel: Model<Outcome>) {
    super(outcomeModel);
  }
}
