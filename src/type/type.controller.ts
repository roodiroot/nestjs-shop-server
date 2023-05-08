import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { TypeService } from './type.service';

@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Post()
  create(@Body() typeDto: CreateTypeDto) {
    return this.typeService.create(typeDto);
  }

  @Get()
  getAll() {
    return this.typeService.getAll();
  }
}
