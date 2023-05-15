import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { TypeService } from './type.service';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';

@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}

  // ====================== СОЗДАНИЕ ТИПА ====================
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() typeDto: CreateTypeDto) {
    return this.typeService.create(typeDto);
  }

  // ====================== ВЫВОД СПИСКА ТИПОВ ===============
  @Get()
  getAll() {
    return this.typeService.getAll();
  }
}
