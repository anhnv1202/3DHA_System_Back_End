import { Bill } from '@models/bill.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class BillsRepository extends BaseRepository<Bill> {
  constructor(@InjectModel(Bill.name) billModel: Model<Bill>) {
    super(billModel);
  }
}
