import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { FastifyRequest } from "fastify";

import { AuthService } from "../auth.service";
import type { SessionPayload } from "../auth.service";

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest & { user?: SessionPayload }>();
    const payload = this.authService.verifyToken(request);
    if (!payload) throw new UnauthorizedException();
    request.user = payload;
    return true;
  }
}
