import { Module } from "@nestjs/common";

import { CatModule } from "./module/core/cat/cat.module";

@Module({
  imports: [CatModule],
})
export class AppModule {}
