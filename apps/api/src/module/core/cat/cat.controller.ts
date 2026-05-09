import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CatService } from "./cat.service";
import { CatDto } from "./dto/cat.dto";
import { CreateCatDto } from "./dto/create-cat.dto";

@ApiTags("Gatos")
@Controller("cat")
export class CatController {
  constructor(@Inject(CatService) private readonly catsService: CatService) {}

  @Get()
  @ApiOperation({
    summary: "Obtener todos los gatos",
    description: "Retorna una lista de todos los gatos registrados en la base de datos",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de gatos obtenida exitosamente",
    type: [CatDto],
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  findAll() {
    return this.catsService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: "Crear un nuevo gato",
    description: "Crea un nuevo registro de gato en la base de datos",
  })
  @ApiBody({
    type: CreateCatDto,
    description: "Datos del gato a crear",
  })
  @ApiResponse({
    status: 201,
    description: "Gato creado exitosamente",
    type: CatDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos inválidos en la solicitud",
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto.name);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Actualizar un gato",
    description: "Actualiza el registro de un gato específico por su ID",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "ID único del gato a actualizar",
    example: 1,
  })
  @ApiBody({
    type: CreateCatDto,
    description: "Datos actualizados del gato",
  })
  @ApiResponse({
    status: 200,
    description: "Gato actualizado exitosamente",
    type: CatDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos inválidos en la solicitud",
  })
  @ApiResponse({
    status: 404,
    description: "Gato no encontrado",
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  update(@Param("id") id: number, @Body() createCatDto: CreateCatDto) {
    return this.catsService.update(id, createCatDto.name);
  }
}
