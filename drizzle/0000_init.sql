CREATE TABLE "app_meta" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"patient" text NOT NULL,
	"treatment" text DEFAULT '' NOT NULL,
	"preferred_time" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"handled_at" timestamp with time zone,
	"handled_by" text,
	CONSTRAINT "appointment_requests_patient_check" CHECK ("appointment_requests"."patient" in ('enfant', 'adolescent', 'adulte')),
	CONSTRAINT "appointment_requests_status_check" CHECK ("appointment_requests"."status" in ('new', 'handled'))
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"mime" text NOT NULL,
	"data" "bytea" NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"user_id" uuid,
	"channel" text DEFAULT 'whatsapp' NOT NULL,
	"recipient" text NOT NULL,
	"recipient_name" text NOT NULL,
	"status" text NOT NULL,
	"provider_id" text,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"cover" jsonb,
	"status" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"seo_title" text DEFAULT '' NOT NULL,
	"seo_description" text DEFAULT '' NOT NULL,
	"updated_by" text,
	CONSTRAINT "posts_category_check" CHECK ("posts"."category" in ('cabinet', 'conseils', 'congres')),
	CONSTRAINT "posts_status_check" CHECK ("posts"."status" in ('draft', 'published'))
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"password_hash" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"session_version" integer DEFAULT 1 NOT NULL,
	"must_change_password" boolean DEFAULT false NOT NULL,
	"whatsapp" text,
	"notify_whatsapp" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone,
	CONSTRAINT "users_role_check" CHECK ("users"."role" in ('admin', 'editor', 'assistant'))
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_request_id_appointment_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."appointment_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appointment_requests_status_idx" ON "appointment_requests" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "notifications_request_idx" ON "notifications" USING btree ("request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_key" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_published_idx" ON "posts" USING btree ("status","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "posts_single_featured" ON "posts" USING btree ("featured") WHERE "posts"."featured";--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");