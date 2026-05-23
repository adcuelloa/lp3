CREATE TABLE "core"."solicitud" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "core"."solicitud_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cat_id" integer NOT NULL,
	"nombre" text NOT NULL,
	"email" text NOT NULL,
	"telefono" text,
	"mensaje" text,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "solicitud_cat_id_idx" ON "core"."solicitud" ("cat_id");--> statement-breakpoint
CREATE INDEX "solicitud_estado_idx" ON "core"."solicitud" ("estado");--> statement-breakpoint
ALTER TABLE "core"."solicitud" ADD CONSTRAINT "solicitud_cat_id_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "core"."cat"("id");