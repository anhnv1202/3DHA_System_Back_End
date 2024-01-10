import { Token } from '@models/Token.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class TokensRepository extends BaseRepository<Token> {
  constructor(@InjectModel(Token.name) tokenModel: Model<Token>) {
    super(tokenModel);
  }
}
