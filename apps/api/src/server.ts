import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { securityConfig } from "./config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableCors({
    origin: securityConfig.corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Establecer prefijo global para todas las rutas
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("API de Gatos")
    .setVersion("1.0.0")
    .addTag("Gatos", "Operaciones relacionadas con gatos")
    .addServer("http://localhost:3000", "Desarrollo local")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, "0.0.0.0");

  console.info(`✅ Servidor ejecutándose en http://localhost:${port}`);
  console.info(`📚 Documentación disponible en http://localhost:${port}/docs`);
}

void bootstrap();
