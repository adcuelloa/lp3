import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCatDto {
  @ApiProperty({ description: "Cat name", type: String, example: "Whiskers" })
  name!: string;

  @ApiPropertyOptional({ description: "Breed ID", type: Number })
  breedId?: number;

  @ApiPropertyOptional({ description: "Coat color", type: String, example: "Orange tabby" })
  color?: string;

  @ApiPropertyOptional({
    description: "Gender",
    type: String,
    enum: ["male", "female", "unknown"],
    default: "unknown",
  })
  gender?: string;

  @ApiPropertyOptional({ description: "Age in months", type: Number, example: 24 })
  ageMonths?: number;

  @ApiPropertyOptional({ description: "Weight in kilograms", type: Number, example: 4.5 })
  weightKg?: number;

  @ApiPropertyOptional({ description: "Description or notes", type: String })
  description?: string;

  @ApiPropertyOptional({ description: "Available for adoption", type: Boolean, default: true })
  isAvailable?: boolean;
}
