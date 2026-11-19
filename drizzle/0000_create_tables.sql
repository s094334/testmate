CREATE TABLE `dispute_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`agreed_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`email` text NOT NULL,
	`ip` text NOT NULL,
	`failed_count` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`email`, `ip`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL,
	`password_iterations` integer NOT NULL,
	`role` text NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT "users_role_values" CHECK("users"."role" in ('owner', 'tester'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer NOT NULL,
	CONSTRAINT "tags_category_values" CHECK("tags"."category" in ('device', 'industry', 'interest', 'audience'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_category_name_unique` ON `tags` (`category`,`name`);--> statement-breakpoint
CREATE TABLE `tester_devices` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`device_tag_id` text,
	`brand` text,
	`model` text,
	`os_version` text,
	`custom_name` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `tester_profiles`(`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`device_tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "tester_devices_listed_or_custom" CHECK(("tester_devices"."device_tag_id" is not null and "tester_devices"."brand" is not null and "tester_devices"."os_version" is not null and "tester_devices"."custom_name" is null)
        or ("tester_devices"."device_tag_id" is null and "tester_devices"."brand" is null and "tester_devices"."model" is null and "tester_devices"."custom_name" is not null))
);
--> statement-breakpoint
CREATE TABLE `tester_profile_tags` (
	`user_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `tag_id`),
	FOREIGN KEY (`user_id`) REFERENCES `tester_profiles`(`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tester_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`real_name` text NOT NULL,
	`phone` text NOT NULL,
	`city` text NOT NULL,
	`has_qa_experience` integer DEFAULT false NOT NULL,
	`experiences` text DEFAULT '[]' NOT NULL,
	`qa_years` integer DEFAULT 0 NOT NULL,
	`languages` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`user_id` text PRIMARY KEY NOT NULL,
	`real_name` text NOT NULL,
	`phone` text NOT NULL,
	`name` text NOT NULL,
	`tax_id` text,
	`industry_tag_id` text NOT NULL,
	`address` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`industry_tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `project_devices` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`device_tag_id` text,
	`brand` text,
	`model` text,
	`min_os_version` text,
	`custom_name` text,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`device_tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "project_devices_listed_or_custom" CHECK(("project_devices"."device_tag_id" is not null and "project_devices"."brand" is not null and "project_devices"."min_os_version" is not null and "project_devices"."custom_name" is null)
        or ("project_devices"."device_tag_id" is null and "project_devices"."brand" is null and "project_devices"."model" is null and "project_devices"."custom_name" is not null))
);
--> statement-breakpoint
CREATE TABLE `project_tags` (
	`project_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`project_id`, `tag_id`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `project_test_items` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`steps` text NOT NULL,
	`expected` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`summary` text NOT NULL,
	`languages` text NOT NULL,
	`qa_experience_required` integer NOT NULL,
	`min_qa_years` text,
	`test_mode` text NOT NULL,
	`test_city` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`reward` integer NOT NULL,
	`report_days` integer NOT NULL,
	`how_to_test` text NOT NULL,
	`success_criteria` text NOT NULL,
	`special_requirements` text,
	`recruitment_status` text DEFAULT 'recruiting' NOT NULL,
	`confidential_details` text,
	`environment_info` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "projects_reward_range" CHECK("projects"."reward" between 1 and 100000),
	CONSTRAINT "projects_report_days_range" CHECK("projects"."report_days" between 1 and 60),
	CONSTRAINT "projects_min_qa_years_only_with_experience" CHECK(("projects"."min_qa_years" is not null) = "projects"."qa_experience_required"),
	CONSTRAINT "projects_test_city_only_onsite" CHECK(("projects"."test_city" is not null) = ("projects"."test_mode" = 'onsite')),
	CONSTRAINT "projects_end_date_after_start_date" CHECK("projects"."end_date" >= "projects"."start_date"),
	CONSTRAINT "projects_min_qa_years_values" CHECK("projects"."min_qa_years" in ('under_1', '1_to_2', '3_to_5', 'over_5')),
	CONSTRAINT "projects_test_mode_values" CHECK("projects"."test_mode" in ('remote', 'onsite')),
	CONSTRAINT "projects_recruitment_status_values" CHECK("projects"."recruitment_status" in ('recruiting', 'closed', 'cancelled'))
);
