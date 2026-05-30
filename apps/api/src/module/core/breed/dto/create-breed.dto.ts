import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateBreedDto {
  @ApiProperty({ description: "Breed name", type: String, example: "Siamese" })
  name!: string;

  @ApiPropertyOptional({ description: "Breed description", type: String })
  description?: string;

  @ApiPropertyOptional({ description: "Country or region of origin", type: String, example: "Thailand" })
  origin?: string;
}
