import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const cookie = req.cookies['jwt'];
      const data = this.jwtService.verify(cookie, {
        secret: 'sdsfggdfghh56h5des',
      });
      if (!data) {
        throw new UnauthorizedException({
          message: 'Ошибка в гварде не валидный токен',
        });
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }
}
