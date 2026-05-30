import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BreedDto {
  @ApiProperty({ description: "Breed ID", type: Number, example: 1 })
  id!: number;

  @ApiProperty({ description: "Breed name", type: String, example: "Siamese" })
  name!: string;

  @ApiPropertyOptional({ description: "Breed description", type: String })
  description?: string | null;

  @ApiPropertyOptional({ description: "Country or region of origin", type: String, example: "Thailand" })
  origin?: string | null;
}
