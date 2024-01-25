import { Enrollment } from '@models/enrollment.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class EnrollmentsRepository extends BaseRepository<Enrollment> {
  constructor(@InjectModel(Enrollment.name) enrollmentModel: Model<Enrollment>) {
    super(enrollmentModel);
  }
}
