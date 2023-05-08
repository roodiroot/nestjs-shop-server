import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reqRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!reqRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user;
      return this.matchRoles(reqRoles, user.role);
    } catch {
      throw new UnauthorizedException({
        message: 'Нет доступа',
      });
    }
  }
  private matchRoles(reqRole: string[], roles: string[]) {
    if (roles.some((role: any) => reqRole.includes(role.name))) return true;
    throw new UnauthorizedException({
      message: 'Печаль',
    });
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
