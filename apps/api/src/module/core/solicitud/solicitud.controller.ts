import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CreateSolicitudDto } from "./dto/create-solicitud.dto";
import { SolicitudDto } from "./dto/solicitud.dto";
import { SolicitudService } from "./solicitud.service";

@ApiTags("Solicitudes")
@Controller("solicitud")
export class SolicitudController {
  constructor(@Inject(SolicitudService) private readonly solicitudService: SolicitudService) {}

  @Get()
  @ApiOperation({ summary: "Obtener todas las solicitudes de adopción" })
  @ApiResponse({ status: 200, type: [SolicitudDto] })
  findAll() {
    return this.solicitudService.findAll();
  }

  @Get("cat/:catId")
  @ApiOperation({ summary: "Obtener solicitudes por gato" })
  @ApiParam({ name: "catId", type: Number })
  @ApiResponse({ status: 200, type: [SolicitudDto] })
  findByCat(@Param("catId") catId: number) {
    return this.solicitudService.findByCat(catId);
  }

  @Post()
  @ApiOperation({ summary: "Crear una solicitud de adopción" })
  @ApiBody({ type: CreateSolicitudDto })
  @ApiResponse({ status: 201, type: SolicitudDto })
  create(@Body() dto: CreateSolicitudDto) {
    return this.solicitudService.create(dto);
  }
}
