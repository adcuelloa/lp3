import fastifyCookie from "@fastify/cookie";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { securityConfig } from "./config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true })
  );

  await app.register(fastifyCookie);

  app.enableCors({
    origin: securityConfig.corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("La Gatería API")
    .setDescription("Cat shelter adoption management API")
    .setVersion("1.0.0")
    .addTag("Auth", "Authentication endpoints")
    .addTag("Breeds", "Cat breed management")
    .addTag("Cats", "Cat registry management")
    .addTag("Applications", "Adoption application management")
    .addServer("http://localhost:3000", "Local development")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, "0.0.0.0");

  console.info(`✅ Server running at http://localhost:${port}`);
  console.info(`📚 Swagger docs at http://localhost:${port}/docs`);
}

void bootstrap();
