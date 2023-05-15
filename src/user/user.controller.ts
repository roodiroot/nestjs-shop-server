import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // @Post('register')
  // async create(@Body() userDto: CreateUserDto) {
  //   return await this.userService.create(userDto);
  // }

  @Post('login')
  async login(
    @Body() dto: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { jwt, user } = await this.userService.login(
      {
        where: { email: dto.email },
      },
      dto.password,
    );
    res.cookie('jwt', jwt, { httpOnly: true, sameSite: 'none', secure: true });

    return user;
  }

  @Get('profile')
  async profile(@Req() req: Request) {
    try {
      const cookie = req.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException();
      }
      const user = await this.userService.findOne({ where: { id: data.id } });
      return { id: user.id, email: user.email, username: user.username };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return {
      message: 'success',
    };
  }
}
