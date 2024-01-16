import { ApiNormalResponse } from './../../common/decorators/api-response/api-normal-response.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TestService } from './test.service';
import { TestDTO } from 'src/dto/test.dto';
import { ResponseType } from '@common/constants/global.const';

@Controller('test')
@ApiTags('test')
export class TestController {
    constructor(private testService: TestService) {}
    
    @Post('create')
    @ApiBearerAuth()
    @ApiBody({ type: TestDTO })
    @ApiNormalResponse({ model: Quizz, type: ResponseType.Ok })
    createCourse(@Body() body: TestDTO): Promise<Quizz> {
      return this.testService.create(body);
    }
}
