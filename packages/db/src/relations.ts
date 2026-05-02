import { defineRelations } from "drizzle-orm";

import * as coreSchema from "./schema/core/index";

// ---------------------------------------------------------------------------
// Relational Queries v2 — single source of truth for all relations
// ---------------------------------------------------------------------------

export const relations = defineRelations(
  {
    ...coreSchema,
  },
  (_r) => ({})
);
