import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoilerPartsService } from './boiler-parts.service';
import { AunthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  FindOneResponse,
  GetBestsellersResponse,
  GetByNameRequest,
  GetByNameResponse,
  GetNewResponse,
  PaginateAndFilterResponse,
  SearchRequest,
  SearchResponse,
} from './types';

@Controller('boiler-parts')
export class BoilerPartsController {
  constructor(private readonly boilerPartsService: BoilerPartsService) {}

  @ApiOkResponse({ type: PaginateAndFilterResponse })
  @UseGuards(AunthenticatedGuard)
  @Get()
  paginateAndFilter(@Query() query) {
    return this.boilerPartsService.paginateAndFilter(query);
  }

  @ApiOkResponse({ type: FindOneResponse })
  @UseGuards(AunthenticatedGuard)
  @Get('find/:id')
  getOne(@Param('id') id: string) {
    return this.boilerPartsService.findOne(id);
  }

  @ApiOkResponse({ type: GetBestsellersResponse })
  @UseGuards(AunthenticatedGuard)
  @Get('bestsellers')
  getBestseller() {
    return this.boilerPartsService.bestsellers();
  }

  @ApiOkResponse({ type: GetNewResponse })
  @UseGuards(AunthenticatedGuard)
  @Get('new')
  getNew() {
    return this.boilerPartsService.new();
  }

  @ApiOkResponse({ type: SearchResponse })
  @ApiBody({ type: SearchRequest })
  @UseGuards(AunthenticatedGuard)
  @Post('search')
  search(@Body() { search }: { search: string }) {
    return this.boilerPartsService.searchByString(search);
  }

  @ApiOkResponse({ type: GetByNameResponse })
  @ApiBody({ type: GetByNameRequest })
  @UseGuards(AunthenticatedGuard)
  @Post('name')
  getByName(@Body() { name }: { name: string }) {
    return this.boilerPartsService.findOneByName(name);
  }
}
