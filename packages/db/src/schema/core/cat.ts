import { index, integer, text } from "drizzle-orm/pg-core";

import { core } from "../../definitions";

export const cat = core.table(
  "cat",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull(),
  },
  (table) => [index("cat_name_idx").on(table.name)]
);
