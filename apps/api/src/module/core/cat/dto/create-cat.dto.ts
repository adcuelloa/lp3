import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO para crear o actualizar un gato
 */
export class CreateCatDto {
  @ApiProperty({
    description: "Nombre del gato",
    type: String,
    example: "Whiskers",
    minLength: 1,
  })
  name!: string;
}
