import { ApiProperty } from "@nestjs/swagger";

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: "New application status",
    type: String,
    enum: ["pending", "approved", "rejected"],
    example: "approved",
  })
  status!: string;
}
