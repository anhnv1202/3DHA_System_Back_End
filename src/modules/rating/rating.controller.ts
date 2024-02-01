import { ResponseType } from '@common/constants/global.const';
import { Profile } from '@common/decorators/user.decorator';
import { Rating } from '@models/rating.model';
import { User } from '@models/user.model';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { RatingDTO, UpdateRatingDTO } from 'src/dto/rating.dto';
import { ApiNormalResponse } from './../../common/decorators/api-response/api-normal-response.decorator';
import { RatingService } from './rating.service';

@Controller('rating')
@ApiTags('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ type: RatingDTO })
  @ApiNormalResponse({ model: Rating, type: ResponseType.Ok })
  createRating(@Body() body: RatingDTO, @Profile() user: User): Promise<Rating> {
    return this.ratingService.create(user, body);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateRatingDTO })
  @ApiNormalResponse({ model: Rating, type: ResponseType.Ok })
  updateRating(@Body() body: UpdateRatingDTO, @Param() params: { id: string }, @Profile() user: User) {
    return this.ratingService.update(user, params.id, body);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Rating, type: ResponseType.Ok })
  deleteRating(@Param() params: { id: string }, @Profile() user: User) {
    return this.ratingService.delete(user, params.id);
  }
}
