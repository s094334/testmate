CREATE TABLE "login_attempts" (
	"email" text NOT NULL,
	"ip" text NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "login_attempts_email_ip_pk" PRIMARY KEY("email","ip")
);
