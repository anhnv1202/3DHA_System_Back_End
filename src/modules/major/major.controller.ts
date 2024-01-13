import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MajorService } from './major.service';
import { Auth } from '@common/decorators/auth.decorator';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ResponseType, Roles } from '@common/constants/global.const';
import { Major } from '@models/major.models';
import { MajorDTO, UpdateMajorDTO } from 'src/dto/major.dto';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/interfaces/pagination-request';
import { Public } from '@common/decorators/common.decorator';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';

@Controller('major')
@ApiTags('major')
export class MajorController {
  constructor(private majorService: MajorService) {}

  @Post('create')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiBody({ type: MajorDTO })
  @ApiNormalResponse({ model: Major, type: ResponseType.Ok })
  createMajor(@Body() body: MajorDTO) {
    return this.majorService.create(body);
  }

  @Get('get-all')
  @Public()
  @ApiQuery({ name: 'user', type: MajorDTO })
  @ApiPaginationResponse(Major)
  getAllMajor(@GetPagination() pagination: Pagination): Promise<PaginationResult<Major>> {
    return this.majorService.getAll(pagination);
  }

  @Get('get/:id')
  @Public()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Major, type: ResponseType.Ok })
  getOneMajor(@Param() body: { id: string }): Promise<Major> {
    return this.majorService.getOne(body.id);
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: UpdateMajorDTO })
  @ApiNormalResponse({ model: Major, type: ResponseType.Ok })
  updateMajor(@Body() body: UpdateMajorDTO, @Param() params: { id: string }) {
    return this.majorService.update(params.id,body );
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Auth([Roles.ADMIN])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Major, type: ResponseType.Ok })
  deleteMajor( @Param() params: { id: string }) {
    return this.majorService.delete(params.id);
  }

 

}
