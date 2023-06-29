import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AunthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated;
  }
}
