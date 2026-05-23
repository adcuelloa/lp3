import { Module } from "@nestjs/common";

import { CatModule } from "./module/core/cat/cat.module";
import { SolicitudModule } from "./module/core/solicitud/solicitud.module";

@Module({
  imports: [CatModule, SolicitudModule],
})
export class AppModule {}
