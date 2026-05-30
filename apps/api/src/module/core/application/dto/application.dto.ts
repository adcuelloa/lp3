import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ApplicationDto {
  @ApiProperty({ description: "Application ID", type: Number, example: 1 })
  id!: number;

  @ApiProperty({ description: "Cat ID", type: Number, example: 1 })
  catId!: number;

  @ApiProperty({ description: "Applicant full name", type: String, example: "Ana García" })
  applicantName!: string;

  @ApiProperty({ description: "Applicant email", type: String, example: "ana@email.com" })
  applicantEmail!: string;

  @ApiPropertyOptional({ description: "Applicant phone number", type: String })
  phone?: string | null;

  @ApiPropertyOptional({ description: "Adoption motivation message", type: String })
  message?: string | null;

  @ApiProperty({ description: "Application status", type: String, enum: ["pending", "approved", "rejected"], example: "pending" })
  status!: string;

  @ApiProperty({ description: "Submission timestamp", type: String })
  createdAt!: Date;
}
