import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';
import { Token } from '../../models/token.model';

@Injectable()
export class TokensRepository extends BaseRepository<Token> {
  constructor(@InjectModel(Token.name) tokenModel: Model<Token>) {
    super(tokenModel);
  }
}
