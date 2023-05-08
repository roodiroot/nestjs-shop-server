import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Get('/all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
