CREATE SCHEMA "core";
--> statement-breakpoint
CREATE TABLE "core"."cat" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "core"."cat_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "cat_name_idx" ON "core"."cat" ("name");