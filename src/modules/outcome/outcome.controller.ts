import { ApiNormalResponse } from './../../common/decorators/api-response/api-normal-response.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OutcomeDTO } from 'src/dto/outcome.dto';
import { ResponseType } from '@common/constants/global.const';
import { Quizz } from '@models/quizz.model';
import { Profile } from '@common/decorators/user.decorator';
import { User } from '@models/user.model';
import { OutcomeService } from './outcome.service';
import { OutcomeList } from '@models/outcomeList.model';
import { OutcomeListDTO } from 'src/dto/outcomeList.dto';

@Controller('outcome')
@ApiTags('outcome')
export class OutcomeController {
  constructor(private outcomeService: OutcomeService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ type: OutcomeDTO })
  @ApiNormalResponse({ model: Quizz, type: ResponseType.Ok })
  createOutcome(@Body() body: OutcomeDTO, @Profile() user: User) {
    return this.outcomeService.create(user, body);
  }

  @Post('calculate')
  @ApiBearerAuth()
  @ApiBody({ type: OutcomeListDTO })
  @ApiNormalResponse({ model: OutcomeList, type: ResponseType.Ok })
  calculateOutcome(@Body() body: OutcomeListDTO, @Profile() user: User) {
    return this.outcomeService.calculate(user, body);
  }
}
