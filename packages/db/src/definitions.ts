import { snakeCase } from "drizzle-orm/pg-core";

export const core = snakeCase.schema("core");
