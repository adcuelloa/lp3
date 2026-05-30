import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { FastifyReply, FastifyRequest } from "fastify";

import type { SessionPayload } from "./auth.service";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { CookieAuthGuard } from "./guards/cookie-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Create a member account and log in" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: "Registered and logged in — access_token cookie set" })
  @ApiResponse({ status: 409, description: "Email already registered" })
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    return this.authService.register(dto, reply);
  }

  @Post("login")
  @ApiOperation({ summary: "Log in — sets access_token cookie" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Logged in — access_token cookie set" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    return this.authService.login(dto.email, dto.password, reply);
  }

  @Post("logout")
  @ApiOperation({ summary: "Log out — clears access_token cookie" })
  @ApiResponse({ status: 200 })
  logout(@Res({ passthrough: true }) reply: FastifyReply) {
    this.authService.logout(reply);
    return { ok: true };
  }

  @Get("me")
  @UseGuards(CookieAuthGuard)
  @ApiOperation({ summary: "Get current authenticated user" })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  me(@Req() req: FastifyRequest & { user: SessionPayload }) {
    return req.user;
  }
}
