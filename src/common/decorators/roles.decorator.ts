import { ROLE_PERMISSION } from '@models/user.model';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE_PERMISSION[]) =>
  SetMetadata(ROLES_KEY, roles);
