import { Outcome, OutcomeSchema } from '@models/outcome.model';
import { OutcomeListModule } from '@modules/outcome-list/outcome-list.module';
import { QuestionModule } from '@modules/question/question.module';
import { QuizzModule } from '@modules/quizz/quizz.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OutcomeController } from './outcome.controller';
import { OutcomesRepository } from './outcome.repository';
import { OutcomeService } from './outcome.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Outcome.name, schema: OutcomeSchema }]),
    QuizzModule,
    QuestionModule,
    OutcomeModule,
    OutcomeListModule,
    UserModule,
  ],
  controllers: [OutcomeController],
  providers: [OutcomesRepository, OutcomeService],
  exports: [OutcomesRepository, OutcomeService],
})
export class OutcomeModule {}
