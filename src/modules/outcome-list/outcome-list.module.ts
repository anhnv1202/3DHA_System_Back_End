import { Module } from '@nestjs/common';
import { OutcomeListController } from './outcome-list.controller';
import { OutcomeListService } from './outcome-list.service';
import { OutcomeList, OutcomeListSchema } from '@models/outcomeList.model';
import { MongooseModule } from '@nestjs/mongoose';
import { OutcomeListsRepository } from './outcome-list.repository';
import { QuizzModule } from '@modules/quizz/quizz.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: OutcomeList.name, schema: OutcomeListSchema }]), QuizzModule],
  controllers: [OutcomeListController],
  providers: [OutcomeListsRepository, OutcomeListService],
  exports: [OutcomeListsRepository, OutcomeListService],
})
export class OutcomeListModule {}
