import { Token, TokenSchema } from '@models/Token.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenController } from './token.controller';
import { TokensRepository } from './token.repository';
import { TokenService } from './token.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  controllers: [TokenController],
  providers: [TokensRepository, TokenService],
  exports: [TokensRepository, TokenService],
})
export class TokenModule {}
