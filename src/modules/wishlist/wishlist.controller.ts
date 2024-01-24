import { ResponseType } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Profile } from '@common/decorators/user.decorator';
import { User } from '@models/user.model';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { WishlistDTO } from 'src/dto/wishList.dto';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@ApiTags('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}
  @Get('get')
  @ApiBearerAuth()
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  getUser(@Profile() user: User) {
    return this.wishlistService.getAll(user);
  }

  @Put('update')
  @ApiBearerAuth()
  @ApiBody({ type: WishlistDTO })
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  updateWishlist(@Body() body: WishlistDTO, @Profile() user: User) {
    return this.wishlistService.update(user, body);
  }
}
