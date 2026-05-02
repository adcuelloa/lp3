/**
 * @module config
 * @summary Configuración centralizada de la aplicación
 * @description Carga y valida variables de entorno.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import type { AppConfig } from "./types";

const apiRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * En `NODE_ENV=test` cargamos `apps/api/.env.test.local` con ruta absoluta (el cwd puede no
 * ser `apps/api`). Si el archivo no existe, se asumen variables ya presentes en `process.env`.
 */
if (process.env.NODE_ENV === "test") {
  try {
    process.loadEnvFile(path.join(apiRootDir, ".env.test.local"));
  } catch {
    // ok: variables de test ya definidas en el entorno (p. ej. CI)
  }
} else if (process.env.NODE_ENV !== "production") {
  // En desarrollo local (NODE_ENV=development o undefined), intentamos leer el symlink
  try {
    process.loadEnvFile();
  } catch (error: unknown) {
    const errorCode =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : undefined;

    if (errorCode !== "ENOENT") {
      console.error("Error inesperado al cargar el archivo .env:", error);
    }
    // Si es ENOENT, lo ignoramos (útil si alguna vez corres dev sin el symlink)
  }
}

// Helper simple para normalizar booleanos de entorno
const isTrue = (val: string | undefined) => val?.toLowerCase() === "true";

const {
  PORT = "3000",
  NODE_ENV = "development",
  TRUST_PROXY = "false",
  DB_USER = "project_dev",
  DB_PASS = "dev_password",
  DB_HOST = "localhost",
  DB_PORT = "5433",
  DB_NAME = "project_dev",
  DB_POOL_MAX = "10",
  DB_POOL_IDLE_TIMEOUT_MS = "30000",
  DB_POOL_CONNECTION_TIMEOUT_MS = "5000",
  JWT_SECRET = "",
  JWT_ACCESS_EXPIRES_IN = "900",
  ARGON2_TIME_COST = "3",
  ARGON2_MEMORY_EXP = "16",
  ARGON2_PARALLELISM = "1",
  CORS_ORIGIN = "http://localhost:5173",
  LOG_LEVEL = "info",
  LOG_PETICION_HOSTS = "",
  API_PREFIX = "/api",
} = process.env;

const config: AppConfig = {
  server: {
    port: parseInt(PORT, 10),
    trustProxy: isTrue(TRUST_PROXY),
    apiPrefix: API_PREFIX,
  },
  env: NODE_ENV,
  isProd: NODE_ENV === "production",
  isDev: NODE_ENV === "development",
  database: {
    url:
      process.env.DATABASE_URL ||
      `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    poolMax: parseInt(DB_POOL_MAX, 10) || 10,
    poolIdleTimeoutMs: parseInt(DB_POOL_IDLE_TIMEOUT_MS, 10) || 30_000,
    poolConnectionTimeoutMs: parseInt(DB_POOL_CONNECTION_TIMEOUT_MS, 10) || 5_000,
  },
  security: {
    argon2Options: {
      timeCost: parseInt(ARGON2_TIME_COST, 10) || 3,
      memoryCost: 2 ** (parseInt(ARGON2_MEMORY_EXP, 10) || 16),
      parallelism: parseInt(ARGON2_PARALLELISM, 10) || 1,
    },
    corsOrigin: CORS_ORIGIN.split(","),
  },
  logging: {
    level: LOG_LEVEL,
    auditLogHosts: LOG_PETICION_HOSTS.split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean),
  },
  jwt: {
    secret: JWT_SECRET,
    accessExpiresIn: parseInt(JWT_ACCESS_EXPIRES_IN, 10),
  },
};

/**
 * Valida variables de entorno críticas.
 */
function requireEnvVars(vars: string[]) {
  if (!config.isProd) return;

  const missing = vars.filter((v) => {
    // Verificamos directamente en process.env para asegurar que existen en el entorno
    const value = process.env[v];
    return !value || value.trim() === "";
  });

  if (missing.length > 0) {
    const separator = "=".repeat(50);
    const errorMessage =
      `\n${separator}\n` +
      `❌ ERROR CRÍTICO DE CONFIGURACIÓN\n` +
      `Faltan variables obligatorias en PRODUCCIÓN:\n` +
      ` - ${missing.join("\n - ")}\n` +
      `${separator}\n`;

    console.error(errorMessage);
    process.exit(1);
  }
}

// Variables que no pueden faltar bajo ninguna circunstancia
requireEnvVars(["JWT_SECRET", "CORS_ORIGIN", "DB_HOST", "DB_USER", "DB_PASS", "DB_NAME"]);

export const serverConfig = config.server;
export const databaseConfig = config.database;
export const securityConfig = config.security;
export const loggingConfig = config.logging;
export const jwtConfig = config.jwt;
export const isProd = config.isProd;
export const isDev = config.isDev;

/** Objeto de configuración inmutable. */
export default Object.freeze(config);
