CREATE TYPE "public"."tag_category" AS ENUM('device', 'industry', 'interest', 'audience');--> statement-breakpoint
CREATE TABLE "companies" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"real_name" text NOT NULL,
	"phone" text NOT NULL,
	"name" text NOT NULL,
	"tax_id" text,
	"industry_tag_id" uuid NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dispute_agreements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"agreed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "tag_category" NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "tags_category_name_unique" UNIQUE("category","name")
);
--> statement-breakpoint
CREATE TABLE "tester_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"device_tag_id" uuid NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"os_version" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tester_profile_tags" (
	"user_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "tester_profile_tags_user_id_tag_id_pk" PRIMARY KEY("user_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tester_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"real_name" text NOT NULL,
	"phone" text NOT NULL,
	"city" text NOT NULL,
	"qa_years" integer DEFAULT 0 NOT NULL,
	"languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_industry_tag_id_tags_id_fk" FOREIGN KEY ("industry_tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_agreements" ADD CONSTRAINT "dispute_agreements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tester_devices" ADD CONSTRAINT "tester_devices_user_id_tester_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tester_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tester_devices" ADD CONSTRAINT "tester_devices_device_tag_id_tags_id_fk" FOREIGN KEY ("device_tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tester_profile_tags" ADD CONSTRAINT "tester_profile_tags_user_id_tester_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tester_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tester_profile_tags" ADD CONSTRAINT "tester_profile_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tester_profiles" ADD CONSTRAINT "tester_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;