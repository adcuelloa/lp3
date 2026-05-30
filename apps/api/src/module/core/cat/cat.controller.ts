import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { FastifyRequest } from "fastify";

import { Roles } from "../auth/decorators/roles.decorator";
import type { SessionPayload } from "../auth/auth.service";
import { CookieAuthGuard } from "../auth/guards/cookie-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CatService } from "./cat.service";
import { CatDto } from "./dto/cat.dto";
import { CreateCatDto } from "./dto/create-cat.dto";

@ApiTags("Cats")
@Controller("cat")
export class CatController {
  constructor(@Inject(CatService) private readonly catService: CatService) {}

  @Get()
  @ApiOperation({ summary: "Get all cats (public)" })
  @ApiResponse({ status: 200, type: [CatDto] })
  findAll() {
    return this.catService.findAll();
  }

  @Post()
  @UseGuards(CookieAuthGuard, RolesGuard)
  @Roles("admin", "member")
  @ApiOperation({ summary: "Register a new cat (admin or member)" })
  @ApiBody({ type: CreateCatDto })
  @ApiResponse({ status: 201, type: CatDto })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 403 })
  create(
    @Body() dto: CreateCatDto,
    @Req() req: FastifyRequest & { user: SessionPayload },
  ) {
    return this.catService.create(dto, req.user.sub);
  }

  @Patch(":id")
  @UseGuards(CookieAuthGuard, RolesGuard)
  @Roles("admin", "member")
  @ApiOperation({ summary: "Update a cat (admin or member)" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: CreateCatDto })
  @ApiResponse({ status: 200, type: CatDto })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 403 })
  update(@Param("id") id: number, @Body() dto: CreateCatDto) {
    return this.catService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(CookieAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Delete a cat (admin only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, type: CatDto })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 403 })
  remove(@Param("id") id: number) {
    return this.catService.remove(id);
  }
}
