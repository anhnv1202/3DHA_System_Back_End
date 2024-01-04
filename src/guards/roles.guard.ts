import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/common/constants/global.const';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { getUserTokenByRequest } from './guard.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = getUserTokenByRequest(request);
    const permissions = user.permissions;
    const isValid = permissions.some((permission) =>
      requiredRoles.includes(permission),
    );

    return isValid;
  }
}
