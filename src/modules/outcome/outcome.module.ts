import { Module } from '@nestjs/common';
import { OutcomeController } from './outcome.controller';
import { OutcomeService } from './outcome.service';
import { Outcome, OutcomeSchema } from '@models/outcome.model';
import { MongooseModule } from '@nestjs/mongoose';
import { OutcomesRepository } from './outcome.repository';
import { QuizzModule } from '@modules/quizz/quizz.module';
import { QuestionModule } from '@modules/question/question.module';
import { OutcomeListModule } from '@modules/outcome-list/outcome-list.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Outcome.name, schema: OutcomeSchema }]),QuizzModule,QuestionModule,OutcomeModule,OutcomeListModule],
  controllers: [OutcomeController],
  providers: [OutcomesRepository,OutcomeService],
  exports: [OutcomesRepository, OutcomeService],

})
export class OutcomeModule {}
