import { boolean, index, integer, real, text, timestamp } from "drizzle-orm/pg-core";

import { core } from "../../definitions";
import { breed } from "./breed";
import { user } from "./user";

export const cat = core.table(
  "cat",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull(),
    breedId: integer("breed_id").references(() => breed.id),
    color: text("color"),
    gender: text("gender").notNull().default("unknown"),
    ageMonths: integer("age_months"),
    weightKg: real("weight_kg"),
    description: text("description"),
    isAvailable: boolean("is_available").notNull().default(true),
    registeredById: integer("registered_by_id").references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("cat_name_idx").on(table.name)]
);
