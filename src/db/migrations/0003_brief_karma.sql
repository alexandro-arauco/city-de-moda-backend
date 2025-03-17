CREATE TABLE "place_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"day" text NOT NULL,
	"initHour" text NOT NULL,
	"endHour" text NOT NULL,
	"place_id" integer
);
