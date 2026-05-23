import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSolicitudDto {
  @ApiProperty({ description: "ID del gato a adoptar", type: Number, example: 1 })
  catId!: number;

  @ApiProperty({ description: "Nombre del solicitante", type: String, example: "Ana García" })
  nombre!: string;

  @ApiProperty({ description: "Correo del solicitante", type: String, example: "ana@email.com" })
  email!: string;

  @ApiPropertyOptional({ description: "Teléfono del solicitante", type: String, example: "+57 300 000 0000" })
  telefono?: string;

  @ApiPropertyOptional({ description: "Mensaje o motivo de adopción", type: String })
  mensaje?: string;
}
