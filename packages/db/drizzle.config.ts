/// <reference types="node" />
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "drizzle-kit";

const filename = fileURLToPath(import.meta.url);
const dir = dirname(filename);

const envPath = resolve(dir, "../../env/backend.env");

try {
  process.loadEnvFile(envPath);
} catch {
  // Silent failure (only dev)
}

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

const dbUrl = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export default defineConfig({
  schema: "./src/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  schemaFilter: ["public", "core"],
  dbCredentials: {
    url: dbUrl,
  },
});
