import { integer, text } from "drizzle-orm/pg-core";

import { core } from "../../definitions";

export const breed = core.table("breed", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  description: text("description"),
  origin: text("origin"),
});
