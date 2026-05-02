/** Configuración del servidor Express. */
export interface ServerConfig {
  port: number;
  trustProxy: boolean;
  apiPrefix?: string | undefined;
}

/** Conexión a la base de datos principal. */
export interface DatabaseConfig {
  url: string;
  poolMax: number;
  poolIdleTimeoutMs: number;
  poolConnectionTimeoutMs: number;
}

/** Parámetros de seguridad (CORS, Hashing). */
export interface SecurityConfig {
  argon2Options: {
    memoryCost: number; // Calculado como 2 ** memoryCostExp
    timeCost: number;
    parallelism: number;
  };
  corsOrigin: string[];
}

/** Niveles de log y filtros de host. */
export interface LoggingConfig {
  level: string;
  auditLogHosts: string[];
}

/** Configuración de tokens JWT. */
export interface JWTConfig {
  secret: string;
  accessExpiresIn: number;
}

/** Interfaz principal de configuración de la aplicación. */
export interface AppConfig {
  server: ServerConfig;
  env: string;
  isProd: boolean;
  isDev: boolean;
  database: DatabaseConfig;
  security: SecurityConfig;
  logging: LoggingConfig;
  jwt: JWTConfig;
}
