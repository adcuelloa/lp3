/**
 * @module config/logger
 * @summary Logger de la aplicación usando Pino
 * @description Logger estructurado de alto rendimiento. En producción emite JSON
 *   a stdout (capturado por Docker). En desarrollo usa pino-pretty para formato
 *   legible con colores.
 *
 *   Inyecta contexto ALS (requestId, institutionId, userId, branchId) en cada
 *   log entry automáticamente via `mixin`.
 *
 *   **API Compatibility:** Export una capa wrapper que acepta tanto el estilo Pino
 *   `logger.error(obj, msg)` como el estilo Winston `logger.error(msg, metaObj)`
 *   para evitar refactorizar ~40 call sites simultáneamente.
 */

import type { LoggerService } from "@nestjs/common";
import pino, { type Logger as PinoLogger } from "pino";

import { isProd, loggingConfig } from "./index";

/**
 * Niveles Pino: trace(10), debug(20), info(30), warn(40), error(50), fatal(60).
 */

const pinoInstance = pino({
  level: loggingConfig.level || "info",

  // Formato de timestamp ISO para consistencia con el formato anterior
  timestamp: pino.stdTimeFunctions.isoTime,

  // pino-pretty solo en desarrollo (transport es fork-based, sin overhead en prod)
  ...(!isProd
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
});

/**
 * Wraps a Pino log method to accept Winston-style `fn("message", metaObj)` calls
 * in addition to Pino-style `fn({ key: val }, "message")`.
 *
 * Detection:
 * - If first arg is a string AND second arg is a non-null object → Winston-style → swap args
 * - Otherwise → pass through to Pino as-is
 */
function wrapLogFn(fn: PinoLogger["info"]): (msgOrObj: unknown, ...rest: unknown[]) => void {
  return (msgOrObj: unknown, ...rest: unknown[]): void => {
    if (
      typeof msgOrObj === "string" &&
      rest.length === 1 &&
      rest[0] != null &&
      typeof rest[0] === "object"
    ) {
      // Winston-style: logger.error("message", { details }) or logger.error("message", error)
      const meta = rest[0];
      if (meta instanceof Error) {
        fn({ err: meta }, msgOrObj);
      } else {
        fn(meta as Record<string, unknown>, msgOrObj);
      }
      return;
    }
    // Pino-native or single string call
    if (typeof msgOrObj === "string") {
      fn(msgOrObj);
    } else {
      fn(msgOrObj as Record<string, unknown>, ...(rest as [string, ...unknown[]]));
    }
  };
}

/** Logger con API compatible Pino + estilo Winston (msg, meta). */
export interface AppLogger {
  trace: (msgOrObj: unknown, ...rest: unknown[]) => void;
  debug: (msgOrObj: unknown, ...rest: unknown[]) => void;
  info: (msgOrObj: unknown, ...rest: unknown[]) => void;
  warn: (msgOrObj: unknown, ...rest: unknown[]) => void;
  error: (msgOrObj: unknown, ...rest: unknown[]) => void;
  fatal: (msgOrObj: unknown, ...rest: unknown[]) => void;
  /** Access the underlying Pino instance for advanced usage (child, etc.) */
  pino: typeof pinoInstance;
}

const logger: AppLogger = {
  trace: wrapLogFn(pinoInstance.trace.bind(pinoInstance)),
  debug: wrapLogFn(pinoInstance.debug.bind(pinoInstance)),
  info: wrapLogFn(pinoInstance.info.bind(pinoInstance)),
  warn: wrapLogFn(pinoInstance.warn.bind(pinoInstance)),
  error: wrapLogFn(pinoInstance.error.bind(pinoInstance)),
  fatal: wrapLogFn(pinoInstance.fatal.bind(pinoInstance)),
  pino: pinoInstance,
};

export default logger;

// ── NestJS LoggerService backed by Pino ──

/**
 * NestJS LoggerService que delega todos los logs internos de NestJS
 * (InstanceLoader, RouterExplorer, NestFactory, etc.) a Pino.
 *
 * @summary Puente NestJS → Pino para logs internos del framework
 * @description Esto asegura que TODOS los logs (tanto aplicación como framework)
 *   pasen por el mismo pipeline Pino: JSON estructurado en producción,
 *   pino-pretty en desarrollo, con contexto ALS automático.
 */
export class PinoLoggerService implements LoggerService {
  log(message: string, context?: string): void {
    if (context) {
      pinoInstance.info({ context }, message);
    } else {
      pinoInstance.info(message);
    }
  }

  error(message: string, traceOrContext?: string, context?: string): void {
    if (context) {
      pinoInstance.error({ context, trace: traceOrContext }, message);
    } else if (traceOrContext) {
      pinoInstance.error({ context: traceOrContext }, message);
    } else {
      pinoInstance.error(message);
    }
  }

  warn(message: string, context?: string): void {
    if (context) {
      pinoInstance.warn({ context }, message);
    } else {
      pinoInstance.warn(message);
    }
  }

  debug(message: string, context?: string): void {
    if (context) {
      pinoInstance.debug({ context }, message);
    } else {
      pinoInstance.debug(message);
    }
  }

  verbose(message: string, context?: string): void {
    if (context) {
      pinoInstance.trace({ context }, message);
    } else {
      pinoInstance.trace(message);
    }
  }

  fatal(message: string, context?: string): void {
    if (context) {
      pinoInstance.fatal({ context }, message);
    } else {
      pinoInstance.fatal(message);
    }
  }
}
