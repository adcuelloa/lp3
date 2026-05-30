CREATE TABLE "core"."breed" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "core"."breed_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"origin" text,
	CONSTRAINT "breed_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "core"."application" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "core"."application_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cat_id" integer NOT NULL,
	"applicant_name" text NOT NULL,
	"applicant_email" text NOT NULL,
	"phone" text,
	"message" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD COLUMN "breed_id" integer;
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD COLUMN "color" text;
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD COLUMN "gender" text DEFAULT 'unknown' NOT NULL;
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD COLUMN "age_months" integer;
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD COLUMN "weight_kg" real;
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD COLUMN "description" text;
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD COLUMN "is_available" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD COLUMN "registered_by_id" integer;
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
CREATE INDEX "application_cat_id_idx" ON "core"."application" ("cat_id");
--> statement-breakpoint
CREATE INDEX "application_status_idx" ON "core"."application" ("status");
--> statement-breakpoint
ALTER TABLE "core"."solicitud" DROP CONSTRAINT "solicitud_cat_id_cat_id_fkey";
--> statement-breakpoint
DROP INDEX "core"."solicitud_cat_id_idx";
--> statement-breakpoint
DROP INDEX "core"."solicitud_estado_idx";
--> statement-breakpoint
DROP TABLE "core"."solicitud";
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD CONSTRAINT "cat_breed_id_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "core"."breed"("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
--> statement-breakpoint
ALTER TABLE "core"."cat" ADD CONSTRAINT "cat_registered_by_id_user_id_fkey" FOREIGN KEY ("registered_by_id") REFERENCES "core"."user"("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
--> statement-breakpoint
ALTER TABLE "core"."application" ADD CONSTRAINT "application_cat_id_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "core"."cat"("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
