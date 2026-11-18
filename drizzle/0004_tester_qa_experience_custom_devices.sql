ALTER TABLE "tester_devices" ALTER COLUMN "device_tag_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tester_devices" ALTER COLUMN "brand" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tester_devices" ALTER COLUMN "model" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tester_devices" ALTER COLUMN "os_version" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tester_devices" ADD COLUMN "custom_name" text;--> statement-breakpoint
ALTER TABLE "tester_devices" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tester_profiles" ADD COLUMN "has_qa_experience" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tester_profiles" ADD COLUMN "experiences" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "tester_devices" ADD CONSTRAINT "tester_devices_listed_or_custom" CHECK (("tester_devices"."device_tag_id" is not null and "tester_devices"."brand" is not null and "tester_devices"."os_version" is not null and "tester_devices"."custom_name" is null)
        or ("tester_devices"."device_tag_id" is null and "tester_devices"."brand" is null and "tester_devices"."model" is null and "tester_devices"."custom_name" is not null));