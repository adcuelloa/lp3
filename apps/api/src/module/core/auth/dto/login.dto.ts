import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "admin@lagateria.com" })
  email!: string;

  @ApiProperty({ example: "Admin1234!" })
  password!: string;
}
