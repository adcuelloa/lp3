import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { Roles } from "../auth/decorators/roles.decorator";
import { CookieAuthGuard } from "../auth/guards/cookie-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ApplicationService } from "./application.service";
import { ApplicationDto } from "./dto/application.dto";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationStatusDto } from "./dto/update-application-status.dto";

@ApiTags("Applications")
@Controller("application")
export class ApplicationController {
  constructor(@Inject(ApplicationService) private readonly applicationService: ApplicationService) {}

  @Get()
  @UseGuards(CookieAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Get all adoption applications (admin only)" })
  @ApiResponse({ status: 200, type: [ApplicationDto] })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 403 })
  findAll() {
    return this.applicationService.findAll();
  }

  @Get("cat/:catId")
  @UseGuards(CookieAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Get applications for a specific cat (admin only)" })
  @ApiParam({ name: "catId", type: Number })
  @ApiResponse({ status: 200, type: [ApplicationDto] })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 403 })
  findByCat(@Param("catId") catId: number) {
    return this.applicationService.findByCat(catId);
  }

  @Post()
  @ApiOperation({ summary: "Submit an adoption application (public)" })
  @ApiBody({ type: CreateApplicationDto })
  @ApiResponse({ status: 201, type: ApplicationDto })
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationService.create(dto);
  }

  @Patch(":id/status")
  @UseGuards(CookieAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Update application status (admin only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: UpdateApplicationStatusDto })
  @ApiResponse({ status: 200, type: ApplicationDto })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 403 })
  updateStatus(@Param("id") id: number, @Body() dto: UpdateApplicationStatusDto) {
    return this.applicationService.updateStatus(id, dto.status);
  }
}
