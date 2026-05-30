import { Module } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CookieAuthGuard } from "./guards/cookie-auth.guard";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  controllers: [AuthController],
  providers: [AuthService, CookieAuthGuard, RolesGuard],
  exports: [AuthService, CookieAuthGuard, RolesGuard],
})
export class AuthModule {}
