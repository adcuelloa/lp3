CREATE TABLE "core"."role" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "core"."role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL UNIQUE,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "core"."user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "core"."user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password" text NOT NULL,
	"role_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "core"."user" ("email");--> statement-breakpoint
ALTER TABLE "core"."user" ADD CONSTRAINT "user_role_id_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "core"."role"("id");