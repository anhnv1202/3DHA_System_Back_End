import { ResponseType, Roles } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { Auth } from '@common/decorators/auth.decorator';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { ExcludePasswordInterceptor } from '@interceptors/exclude-password.interceptor';
import { PaginationInterceptor } from '@interceptors/pagination.interceptor';
import { User } from '@models/user.model';
import { Body, Controller, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangeActiveDTO } from 'src/dto/common.dto';
import { ChangeRoleUserDTO, UpdateUserDTO, UserQueryDTO } from 'src/dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('get/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, required: true })
  @UseInterceptors(ExcludePasswordInterceptor)
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  getUser(@Param() body: { id: string }): Promise<User> {
    return this.userService.getOne(body.id);
  }

  @Get('get-all')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiQuery({ name: 'user', type: UserQueryDTO })
  @ApiPaginationResponse(User)
  @UseInterceptors(PaginationInterceptor<User>)
  getAllUser(@GetPagination() pagination: Pagination): Promise<PaginationResult<User>> {
    return this.userService.getAll(pagination);
  }

  @Post('active')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiBody({ type: ChangeActiveDTO })
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  changeActiveCorporation(@Body() body: ChangeActiveDTO) {
    return this.userService.active(body);
  }

  @Put('role/:id')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: ChangeRoleUserDTO })
  @UseInterceptors(ExcludePasswordInterceptor)
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  changeRoleUser(@Body() body: ChangeRoleUserDTO, @Param() params: { id: string }) {
    return this.userService.role(body.role, params.id);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateUserDTO })
  @UseInterceptors(ExcludePasswordInterceptor)
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  updateUser(@Body() body: UpdateUserDTO, @Param() params: { id: string }) {
    return this.userService.update(body, params.id);
  }
}
