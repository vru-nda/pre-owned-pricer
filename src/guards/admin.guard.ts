import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    // if user is not logged in
    if (!req.currentUser) return false;

    // is user admin or not
    return req.currentUser.isAdmin;
  }
}
