import { Discount } from '@models/discount.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class DiscountsRepository extends BaseRepository<Discount> {
  constructor(@InjectModel(Discount.name) discountModel: Model<Discount>) {
    super(discountModel);
  }
}
