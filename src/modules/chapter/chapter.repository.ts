import { Chapter } from '@models/chapter.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class ChaptersRepository extends BaseRepository<Chapter> {
  constructor(@InjectModel(Chapter.name) chapterModel: Model<Chapter>) {
    super(chapterModel);
  }
}
