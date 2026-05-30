import { Module } from "@nestjs/common";

import { ApplicationModule } from "./module/core/application/application.module";
import { AuthModule } from "./module/core/auth/auth.module";
import { BreedModule } from "./module/core/breed/breed.module";
import { CatModule } from "./module/core/cat/cat.module";

@Module({
  imports: [AuthModule, BreedModule, CatModule, ApplicationModule],
})
export class AppModule {}
