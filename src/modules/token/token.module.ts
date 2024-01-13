@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  controllers: [TokenController],
  providers: [TokensRepository, TokenService],
  exports: [TokensRepository, TokenService],
})
export class TokenModule {}
