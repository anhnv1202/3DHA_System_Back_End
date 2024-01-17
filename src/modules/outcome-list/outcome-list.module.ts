import { Module } from '@nestjs/common';
import { OutcomeListController } from './outcome-list.controller';
import { OutcomeListService } from './outcome-list.service';
import { OutcomeList, OutcomeListSchema } from '@models/outcomeList.model';
import { MongooseModule } from '@nestjs/mongoose';
import { OutcomeListsRepository } from './outcome-list.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: OutcomeList.name, schema: OutcomeListSchema }])],
  controllers: [OutcomeListsRepository,OutcomeListController],
  providers: [OutcomeListsRepository,OutcomeListService]
})
export class OutcomeListModule {}
