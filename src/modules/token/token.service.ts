import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongodb';
import { Token } from '../../models/token.model';
import { TokensRepository } from './token.repository';

@Injectable()
export class TokenService {
  constructor(private tokenRepository: TokensRepository) {}

  async createOneBy(data: Partial<Token>, session?: ClientSession): Promise<Token | null> {
    return await this.tokenRepository.create({ ...data }, session);
  }

  async getOneBy(data: Partial<Token>): Promise<Token | null> {
    return await this.tokenRepository.findOne({ data });
  }

  async removeById(id: string, session?: ClientSession): Promise<Token | null> {
    return await this.tokenRepository.remove(id, session);
  }

  async deleteExpiredTokens(): Promise<void> {
    return await this.tokenRepository.removeByFilter({
      expiresAt: { $lt: new Date() },
    });
  }
}
