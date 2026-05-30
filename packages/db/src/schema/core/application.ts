import { index, integer, text, timestamp } from "drizzle-orm/pg-core";

import { core } from "../../definitions";
import { cat } from "./cat";

export const application = core.table(
  "application",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    catId: integer("cat_id")
      .notNull()
      .references(() => cat.id),
    applicantName: text("applicant_name").notNull(),
    applicantEmail: text("applicant_email").notNull(),
    phone: text("phone"),
    message: text("message"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("application_cat_id_idx").on(table.catId),
    index("application_status_idx").on(table.status),
  ]
);
