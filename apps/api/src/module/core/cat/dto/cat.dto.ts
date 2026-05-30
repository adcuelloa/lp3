import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CatDto {
  @ApiProperty({ description: "Cat ID", type: Number, example: 1 })
  id!: number;

  @ApiProperty({ description: "Cat name", type: String, example: "Whiskers" })
  name!: string;

  @ApiPropertyOptional({ description: "Breed ID", type: Number })
  breedId?: number | null;

  @ApiPropertyOptional({ description: "Coat color", type: String, example: "Orange tabby" })
  color?: string | null;

  @ApiProperty({ description: "Gender", type: String, enum: ["male", "female", "unknown"], example: "male" })
  gender!: string;

  @ApiPropertyOptional({ description: "Age in months", type: Number, example: 24 })
  ageMonths?: number | null;

  @ApiPropertyOptional({ description: "Weight in kilograms", type: Number, example: 4.5 })
  weightKg?: number | null;

  @ApiPropertyOptional({ description: "Description or notes", type: String })
  description?: string | null;

  @ApiProperty({ description: "Available for adoption", type: Boolean, example: true })
  isAvailable!: boolean;

  @ApiPropertyOptional({ description: "ID of the user who registered this cat", type: Number })
  registeredById?: number | null;

  @ApiProperty({ description: "Registration timestamp", type: String })
  createdAt!: Date;
}
