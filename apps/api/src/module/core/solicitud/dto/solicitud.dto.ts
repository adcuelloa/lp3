import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SolicitudDto {
  @ApiProperty({ description: "ID de la solicitud", type: Number, example: 1 })
  id!: number;

  @ApiProperty({ description: "ID del gato a adoptar", type: Number, example: 1 })
  catId!: number;

  @ApiProperty({ description: "Nombre del solicitante", type: String, example: "Ana García" })
  nombre!: string;

  @ApiProperty({ description: "Correo del solicitante", type: String, example: "ana@email.com" })
  email!: string;

  @ApiPropertyOptional({ description: "Teléfono del solicitante", type: String })
  telefono?: string;

  @ApiPropertyOptional({ description: "Mensaje o motivo de adopción", type: String })
  mensaje?: string;

  @ApiProperty({ description: "Estado de la solicitud", type: String, example: "pendiente" })
  estado!: string;

  @ApiProperty({ description: "Fecha de creación", type: String })
  creadoEn!: Date;
}
