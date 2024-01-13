import { Token } from '@models/Token.model';
import { Injectable } from '@nestjs/common';
import { TokensRepository } from './token.repository';

@Injectable()
export class TokenService {
  constructor(private tokenRepository: TokensRepository) {}

  async createOneBy(data: Partial<Token>): Promise<Token | null> {
    return await this.tokenRepository.create({ ...data });
  }

  async getOneBy(data: Partial<Token>): Promise<Token | null> {
    return await this.tokenRepository.findOne({ data });
  }

  async removeById(id: string): Promise<Token | null> {
    return await this.tokenRepository.remove(id);
  }

  async deleteExpiredTokens(): Promise<void> {
    return await this.tokenRepository.removeByFilter({
      expiresAt: { $lt: new Date() },
    });
  }
}
