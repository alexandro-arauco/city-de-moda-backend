CREATE TABLE "category_place" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" serial NOT NULL,
	"place_id" serial NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"place_id" integer
);
--> statement-breakpoint
CREATE TABLE "place_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"day" text NOT NULL,
	"initHour" text NOT NULL,
	"endHour" text NOT NULL,
	"place_id" integer
);
--> statement-breakpoint
CREATE TABLE "place_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"place_id" integer
);
--> statement-breakpoint
CREATE TABLE "place_social_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"place_id" integer
);
--> statement-breakpoint
CREATE TABLE "place" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"lat" text NOT NULL,
	"lng" text NOT NULL,
	"phone" text NOT NULL,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"urlImage" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"additionalContact" text NOT NULL,
	"whatsapp" boolean DEFAULT false NOT NULL,
	"description" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place_videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"place_id" integer
);
--> statement-breakpoint
ALTER TABLE "category_place" ADD CONSTRAINT "category_place_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_place" ADD CONSTRAINT "category_place_place_id_place_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."place"("id") ON DELETE no action ON UPDATE no action;