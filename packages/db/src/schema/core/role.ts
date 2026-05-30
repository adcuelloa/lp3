import { integer, text } from "drizzle-orm/pg-core";

import { core } from "../../definitions";

export const role = core.table("role", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  description: text("description"),
});
