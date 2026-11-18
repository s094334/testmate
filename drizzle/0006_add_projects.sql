CREATE TYPE "public"."min_qa_years" AS ENUM('under_1', '1_to_2', '3_to_5', 'over_5');--> statement-breakpoint
CREATE TYPE "public"."recruitment_status" AS ENUM('recruiting', 'closed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."test_mode" AS ENUM('remote', 'onsite');--> statement-breakpoint
CREATE TABLE "project_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"device_tag_id" uuid,
	"brand" text,
	"model" text,
	"min_os_version" text,
	"custom_name" text,
	"sort_order" integer NOT NULL,
	CONSTRAINT "project_devices_listed_or_custom" CHECK (("project_devices"."device_tag_id" is not null and "project_devices"."brand" is not null and "project_devices"."min_os_version" is not null and "project_devices"."custom_name" is null)
        or ("project_devices"."device_tag_id" is null and "project_devices"."brand" is null and "project_devices"."model" is null and "project_devices"."custom_name" is not null))
);
--> statement-breakpoint
CREATE TABLE "project_tags" (
	"project_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "project_tags_project_id_tag_id_pk" PRIMARY KEY("project_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "project_test_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"steps" text NOT NULL,
	"expected" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"summary" text NOT NULL,
	"languages" jsonb NOT NULL,
	"qa_experience_required" boolean NOT NULL,
	"min_qa_years" "min_qa_years",
	"test_mode" "test_mode" NOT NULL,
	"test_city" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"reward" integer NOT NULL,
	"report_days" integer NOT NULL,
	"how_to_test" text NOT NULL,
	"success_criteria" text NOT NULL,
	"special_requirements" text,
	"recruitment_status" "recruitment_status" DEFAULT 'recruiting' NOT NULL,
	"confidential_details" text,
	"environment_info" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_reward_range" CHECK ("projects"."reward" between 1 and 100000),
	CONSTRAINT "projects_report_days_range" CHECK ("projects"."report_days" between 1 and 60),
	CONSTRAINT "projects_min_qa_years_only_with_experience" CHECK (("projects"."min_qa_years" is not null) = "projects"."qa_experience_required"),
	CONSTRAINT "projects_test_city_only_onsite" CHECK (("projects"."test_city" is not null) = ("projects"."test_mode" = 'onsite')),
	CONSTRAINT "projects_end_date_after_start_date" CHECK ("projects"."end_date" >= "projects"."start_date")
);
--> statement-breakpoint
ALTER TABLE "project_devices" ADD CONSTRAINT "project_devices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_devices" ADD CONSTRAINT "project_devices_device_tag_id_tags_id_fk" FOREIGN KEY ("device_tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_test_items" ADD CONSTRAINT "project_test_items_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;