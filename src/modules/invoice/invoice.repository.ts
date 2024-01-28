import { Invoice } from '@models/invoice.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class InvoicesRepository extends BaseRepository<Invoice> {
  constructor(@InjectModel(Invoice.name) invoiceModel: Model<Invoice>) {
    super(invoiceModel);
  }
}
