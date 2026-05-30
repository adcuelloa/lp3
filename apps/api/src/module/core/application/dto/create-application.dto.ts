import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateApplicationDto {
  @ApiProperty({ description: "Cat ID to adopt", type: Number, example: 1 })
  catId!: number;

  @ApiProperty({ description: "Applicant full name", type: String, example: "Ana García" })
  applicantName!: string;

  @ApiProperty({ description: "Applicant email", type: String, example: "ana@email.com" })
  applicantEmail!: string;

  @ApiPropertyOptional({
    description: "Applicant phone number",
    type: String,
    example: "+57 300 000 0000",
  })
  phone?: string;

  @ApiPropertyOptional({ description: "Adoption motivation message", type: String })
  message?: string;
}
