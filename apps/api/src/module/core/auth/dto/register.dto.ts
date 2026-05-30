import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "Ana García" })
  name!: string;

  @ApiProperty({ example: "ana@email.com" })
  email!: string;

  @ApiProperty({ example: "MyPassword1!" })
  password!: string;
}
