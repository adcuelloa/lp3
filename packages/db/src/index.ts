/**
 * This file serves as the main entry point for the database package, re-exporting all necessary types, schemas, and utilities.
 * It provides a single source of truth for all database-related imports across the application.
 */

// Schema definitions
export * from "./definitions";

// Core tables + Zod schemas (select/insert)
export * from "./schema/core/index";

// Relational queries v2 (single source of truth)
export { relations } from "./relations";
