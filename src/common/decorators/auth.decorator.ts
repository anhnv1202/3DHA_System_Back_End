import { ROLE_PERMISSION } from '@models/user.model';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from './roles.decorator';

export function Auth(...roles: ROLE_PERMISSION[]) {
  return applyDecorators(Roles(...roles), UseGuards(RolesGuard));
}
