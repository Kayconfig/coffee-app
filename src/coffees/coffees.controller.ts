import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { WrapResponseInterceptor } from '../common/interceptors/wrap-response.interceptor';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@ApiTags('/coffees')
@UseInterceptors(WrapResponseInterceptor)
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  @Get()
  @ApiNotFoundResponse({ description: 'Coffee #{id} not found!' })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Coffee #{id} not found!' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const coffee = this.coffeeService.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`coffee ${id} not found`);
    }
    return coffee;
  }

  @Post()
  async create(@Body() body: CreateCoffeeDto) {
    return this.coffeeService.create(body);
  }

  @Patch(':id')
  @ApiNotFoundResponse({ description: 'Coffee #{id} not found!' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCoffeeDto,
  ) {
    return this.coffeeService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({ description: 'Coffee #{id} not found!' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.coffeeService.remove(id);
  }
}
