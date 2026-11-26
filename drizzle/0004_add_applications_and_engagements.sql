CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`tester_id` text NOT NULL,
	`source` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`tester_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "applications_source_values" CHECK("applications"."source" in ('applied', 'invited')),
	CONSTRAINT "applications_status_values" CHECK("applications"."status" in ('pending', 'selected', 'declined'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `applications_project_id_tester_id_unique` ON `applications` (`project_id`,`tester_id`);--> statement-breakpoint
CREATE TABLE `engagement_events` (
	`id` text PRIMARY KEY NOT NULL,
	`engagement_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`engagement_id`) REFERENCES `engagements`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "engagement_events_from_status_values" CHECK("engagement_events"."from_status" in ('PENDING_NDA', 'PENDING_PAYMENT', 'FUNDED', 'TESTING', 'SUBMITTED', 'DISPUTED', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
	CONSTRAINT "engagement_events_to_status_values" CHECK("engagement_events"."to_status" in ('PENDING_NDA', 'PENDING_PAYMENT', 'FUNDED', 'TESTING', 'SUBMITTED', 'DISPUTED', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
	CONSTRAINT "engagement_events_actor_values" CHECK("engagement_events"."actor" in ('owner', 'tester', 'system'))
);
--> statement-breakpoint
CREATE TABLE `engagements` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`tester_id` text NOT NULL,
	`application_id` text NOT NULL,
	`status` text NOT NULL,
	`nda_due_at` integer NOT NULL,
	`payment_due_at` integer,
	`funded_at` integer,
	`start_due_at` integer,
	`environment_provided_at` integer,
	`report_due_at` integer,
	`report_overdue_at` integer,
	`deadline_extended` integer DEFAULT false NOT NULL,
	`rejection_count` integer DEFAULT 0 NOT NULL,
	`review_due_at` integer,
	`rating_due_at` integer,
	`start_reminded_at` integer,
	`report_reminded_at` integer,
	`overdue_decision_reminded_at` integer,
	`review_reminded_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`tester_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "engagements_status_values" CHECK("engagements"."status" in ('PENDING_NDA', 'PENDING_PAYMENT', 'FUNDED', 'TESTING', 'SUBMITTED', 'DISPUTED', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
	CONSTRAINT "engagements_rejection_count_not_negative" CHECK("engagements"."rejection_count" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `engagements_application_id_unique` ON `engagements` (`application_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `engagements_one_active_per_project` ON `engagements` (`project_id`) WHERE "engagements"."status" <> 'CANCELLED';--> statement-breakpoint
CREATE TABLE `nda_signatures` (
	`id` text PRIMARY KEY NOT NULL,
	`engagement_id` text NOT NULL,
	`tester_id` text NOT NULL,
	`version` text NOT NULL,
	`signed_at` integer NOT NULL,
	FOREIGN KEY (`engagement_id`) REFERENCES `engagements`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`tester_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `nda_signatures_engagement_id_unique` ON `nda_signatures` (`engagement_id`);