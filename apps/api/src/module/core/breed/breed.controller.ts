import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { Roles } from "../auth/decorators/roles.decorator";
import { CookieAuthGuard } from "../auth/guards/cookie-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { BreedService } from "./breed.service";
import { BreedDto } from "./dto/breed.dto";
import { CreateBreedDto } from "./dto/create-breed.dto";

@ApiTags("Breeds")
@Controller("breed")
export class BreedController {
  constructor(@Inject(BreedService) private readonly breedService: BreedService) {}

  @Get()
  @ApiOperation({ summary: "Get all cat breeds (public)" })
  @ApiResponse({ status: 200, type: [BreedDto] })
  findAll() {
    return this.breedService.findAll();
  }

  @Post()
  @UseGuards(CookieAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Create a new breed (admin only)" })
  @ApiBody({ type: CreateBreedDto })
  @ApiResponse({ status: 201, type: BreedDto })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 403 })
  create(@Body() dto: CreateBreedDto) {
    return this.breedService.create(dto);
  }
}
