import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { CatController } from "./cat.controller";
import { CatService } from "./cat.service";

@Module({
  imports: [AuthModule],
  controllers: [CatController],
  providers: [CatService],
})
export class CatModule {}
