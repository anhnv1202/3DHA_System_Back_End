import { Module } from '@nestjs/common';
import { OutcomeController } from './outcome.controller';
import { OutcomeService } from './outcome.service';
import { Outcome, OutcomeSchema } from '@models/outcome.model';
import { MongooseModule } from '@nestjs/mongoose';
import { OutcomesRepository } from './outcome.repository';
import { QuizzModule } from '@modules/quizz/quizz.module';
import { QuestionModule } from '@modules/question/question.module';
import { OutcomeList } from '@models/outcomeList.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Outcome.name, schema: OutcomeSchema }]),QuizzModule,QuestionModule,OutcomeModule,OutcomeList],
  controllers: [OutcomeController],
  providers: [OutcomesRepository,OutcomeService],
  exports: [OutcomesRepository, OutcomeService],

})
export class OutcomeModule {}
