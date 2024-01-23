import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { User } from '@models/user.model';
import { ResponseType } from '@common/constants/global.const';
import { Profile } from '@common/decorators/user.decorator';
import { WishListDTO } from 'src/dto/wishList.dto';


@Controller('wishlist')
@ApiTags('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}
  @Get('get')
  @ApiBearerAuth()
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  getUser(@Profile() user: User){
    return this.wishlistService.getAll(user);
  }

  @Put('update')
  @ApiBearerAuth()
  @ApiBody({ type: WishListDTO })
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  updateWishlist(@Body() body:WishListDTO, @Profile() user: User) {
    return this.wishlistService.update(user, body);
  }
}
