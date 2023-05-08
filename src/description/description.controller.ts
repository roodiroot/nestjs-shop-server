import { Body, Controller, Get, Post } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { CreateDescriptonDto } from './dto/create-description.dto';

@Controller('description')
export class DescriptionController {
  constructor(private descriptService: DescriptionService) {}

  @Post()
  create(@Body() descriptDto: CreateDescriptonDto) {
    return this.descriptService.create(descriptDto);
  }

  @Get()
  getAll() {
    return this.descriptService.getAll();
  }
}
