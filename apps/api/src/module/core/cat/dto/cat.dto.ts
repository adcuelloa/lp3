import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO que representa un gato en la respuesta de la API
 */
export class CatDto {
  @ApiProperty({
    description: "Identificador único del gato",
    type: Number,
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: "Nombre del gato",
    type: String,
    example: "Whiskers",
    minLength: 1,
  })
  name!: string;
}
