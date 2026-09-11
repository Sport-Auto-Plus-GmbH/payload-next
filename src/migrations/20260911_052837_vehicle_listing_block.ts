import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_pages_blocks_vehicle_listing_heading_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TYPE "payload"."enum_pages_blocks_vehicle_listing_subheading_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TYPE "payload"."enum__pages_v_blocks_vehicle_listing_heading_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TYPE "payload"."enum__pages_v_blocks_vehicle_listing_subheading_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TABLE "payload"."pages_blocks_vehicle_listing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_text" varchar,
  	"heading_font_size" "payload"."enum_pages_blocks_vehicle_listing_heading_font_size" DEFAULT 'md',
  	"heading_color" varchar DEFAULT '#323E48',
  	"subheading_text" varchar,
  	"subheading_font_size" "payload"."enum_pages_blocks_vehicle_listing_subheading_font_size" DEFAULT 'md',
  	"subheading_color" varchar DEFAULT '#323E48',
  	"max_items" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_vehicle_listing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_text" varchar,
  	"heading_font_size" "payload"."enum__pages_v_blocks_vehicle_listing_heading_font_size" DEFAULT 'md',
  	"heading_color" varchar DEFAULT '#323E48',
  	"subheading_text" varchar,
  	"subheading_font_size" "payload"."enum__pages_v_blocks_vehicle_listing_subheading_font_size" DEFAULT 'md',
  	"subheading_color" varchar DEFAULT '#323E48',
  	"max_items" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "payload"."pages_blocks_vehicle_listing" ADD CONSTRAINT "pages_blocks_vehicle_listing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_vehicle_listing" ADD CONSTRAINT "_pages_v_blocks_vehicle_listing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_vehicle_listing_order_idx" ON "payload"."pages_blocks_vehicle_listing" USING btree ("_order");
  CREATE INDEX "pages_blocks_vehicle_listing_parent_id_idx" ON "payload"."pages_blocks_vehicle_listing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_vehicle_listing_path_idx" ON "payload"."pages_blocks_vehicle_listing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_vehicle_listing_order_idx" ON "payload"."_pages_v_blocks_vehicle_listing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_vehicle_listing_parent_id_idx" ON "payload"."_pages_v_blocks_vehicle_listing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_vehicle_listing_path_idx" ON "payload"."_pages_v_blocks_vehicle_listing" USING btree ("_path");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."pages_blocks_vehicle_listing" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_vehicle_listing" CASCADE;
  DROP TYPE "payload"."enum_pages_blocks_vehicle_listing_heading_font_size";
  DROP TYPE "payload"."enum_pages_blocks_vehicle_listing_subheading_font_size";
  DROP TYPE "payload"."enum__pages_v_blocks_vehicle_listing_heading_font_size";
  DROP TYPE "payload"."enum__pages_v_blocks_vehicle_listing_subheading_font_size";`)
}
