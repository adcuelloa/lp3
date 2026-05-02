import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { relations } from "@project/db";

import { databaseConfig } from "@/config/index";
import logger from "@/config/logger";

// TODO: Consider using drizzle's built-in connection pooling instead of postgres's, to simplify the code and reduce dependencies. See https://orm.drizzle.team/postgres-js/connection-pooling for details.
export const queryClient = postgres(databaseConfig.url, {
  max: databaseConfig.poolMax,
  idle_timeout: databaseConfig.poolIdleTimeoutMs / 1000,
  connect_timeout: databaseConfig.poolConnectionTimeoutMs / 1000,
  prepare: false,
});

export const db = drizzle({
  client: queryClient,
  relations,
});

export const checkConnection = async () => {
  try {
    logger.debug("CheckConnection: Attempting to connect...");
    await queryClient`SELECT 1`;

    logger.debug("CheckConnection: Connected!");
    logger.info("✅ Drizzle - Conexión a PostgreSQL confirmada");
  } catch (err) {
    logger.error("❌ Drizzle - Error conectando a la base de datos:", err);
    throw err;
  }
};
