import { boolean, index, integer, text, timestamp } from "drizzle-orm/pg-core";

import { core } from "../../definitions";
import { role } from "./role";

export const user = core.table(
  "user",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    roleId: integer("role_id")
      .notNull()
      .references(() => role.id),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("user_email_idx").on(table.email)]
);
