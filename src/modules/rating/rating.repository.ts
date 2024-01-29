import { Rating } from '@models/rating.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class RatingsRepository extends BaseRepository<Rating> {
  constructor(@InjectModel(Rating.name) ratingModel: Model<Rating>) {
    super(ratingModel);
  }
}
