import { PUBLIC_KEY } from '@common/decorators/common.decorator';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(/\s/)[1];
      try {
        const userInfo = this.jwt.verify(token, { secret: process.env.JWT_SECRET_KEY });
        return !!userInfo;
      } catch (err) {
        throw new UnauthorizedException('access-denied');
      }
    }
    throw new UnauthorizedException();
  }
}
