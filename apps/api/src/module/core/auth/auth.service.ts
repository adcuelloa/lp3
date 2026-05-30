import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { argon2id, hash, verify } from "argon2";
import { eq } from "drizzle-orm";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { role, user } from "@project/db";

import { isProd, jwtConfig, securityConfig } from "@/config/index";
import { db } from "@/lib/drizzle";

import type { RegisterDto } from "./dto/register.dto";

export interface SessionPayload {
  sub: number;
  email: string;
  name: string;
  role: string;
}

const COOKIE = "access_token";

@Injectable()
export class AuthService {
  async login(email: string, password: string, reply: FastifyReply) {
    const [found] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        isActive: user.isActive,
        roleName: role.name,
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))
      .where(eq(user.email, email));

    if (!found || !found.isActive) throw new UnauthorizedException("Invalid credentials");

    const valid = await verify(found.password, password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    const payload: SessionPayload = {
      sub: found.id,
      email: found.email,
      name: found.name,
      role: found.roleName,
    };

    this.setSessionCookie(reply, payload);

    return { id: found.id, name: found.name, email: found.email, role: found.roleName };
  }

  async register(dto: RegisterDto, reply: FastifyReply) {
    const [existing] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, dto.email));

    if (existing) throw new ConflictException("Email already registered");

    const [memberRole] = await db.select().from(role).where(eq(role.name, "member"));
    if (!memberRole) throw new InternalServerErrorException("Member role not configured");

    const passwordHash = await hash(dto.password, {
      type: argon2id,
      ...securityConfig.argon2Options,
    });

    const [newUser] = await db
      .insert(user)
      .values({ name: dto.name, email: dto.email, password: passwordHash, roleId: memberRole.id })
      .returning();

    const payload: SessionPayload = {
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: memberRole.name,
    };

    this.setSessionCookie(reply, payload);

    return { id: newUser.id, name: newUser.name, email: newUser.email, role: memberRole.name };
  }

  logout(reply: FastifyReply) {
    void reply.clearCookie(COOKIE, { path: "/" });
  }

  verifyToken(request: FastifyRequest): SessionPayload | null {
    const token = (request.cookies as Record<string, string | undefined>)[COOKIE];
    if (!token) return null;
    try {
      const raw = jwt.verify(token, jwtConfig.secret);
      if (typeof raw === "string") return null;
      return {
        sub: Number(raw["sub"]),
        email: String(raw["email"] ?? ""),
        name: String(raw["name"] ?? ""),
        role: String(raw["role"] ?? ""),
      };
    } catch {
      return null;
    }
  }

  private setSessionCookie(reply: FastifyReply, payload: SessionPayload) {
    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.accessExpiresIn,
    });

    void reply.setCookie(COOKIE, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: jwtConfig.accessExpiresIn,
    });
  }
}
