import { index, integer, text, timestamp } from "drizzle-orm/pg-core";

import { core } from "../../definitions";
import { cat } from "./cat";

export const solicitud = core.table(
  "solicitud",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    catId: integer("cat_id")
      .notNull()
      .references(() => cat.id),
    nombre: text("nombre").notNull(),
    email: text("email").notNull(),
    telefono: text("telefono"),
    mensaje: text("mensaje"),
    estado: text("estado").notNull().default("pendiente"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
  },
  (table) => [
    index("solicitud_cat_id_idx").on(table.catId),
    index("solicitud_estado_idx").on(table.estado),
  ]
);
