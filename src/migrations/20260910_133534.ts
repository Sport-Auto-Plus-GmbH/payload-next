import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__pages_v_blocks_hero_teaser_headline_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TYPE "payload"."enum__pages_v_blocks_hero_teaser_subheadline_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TYPE "payload"."enum__pages_v_blocks_hero_teaser_description_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TYPE "payload"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."_pages_v_blocks_hero_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline_text" varchar,
  	"headline_font_size" "payload"."enum__pages_v_blocks_hero_teaser_headline_font_size" DEFAULT 'md',
  	"headline_color" varchar DEFAULT '#323E48',
  	"subheadline_text" varchar,
  	"subheadline_font_size" "payload"."enum__pages_v_blocks_hero_teaser_subheadline_font_size" DEFAULT 'md',
  	"subheadline_color" varchar DEFAULT '#323E48',
  	"description_text" varchar,
  	"description_font_size" "payload"."enum__pages_v_blocks_hero_teaser_description_font_size" DEFAULT 'md',
  	"description_color" varchar DEFAULT '#323E48',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload"."pages_blocks_hero_teaser" ALTER COLUMN "headline_text" DROP NOT NULL;
  ALTER TABLE "payload"."pages" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "payload"."pages" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "payload"."pages" ADD COLUMN "_status" "payload"."enum_pages_status" DEFAULT 'draft';
  ALTER TABLE "payload"."_pages_v_blocks_hero_teaser" ADD CONSTRAINT "_pages_v_blocks_hero_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "payload"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_hero_teaser_order_idx" ON "payload"."_pages_v_blocks_hero_teaser" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_teaser_parent_id_idx" ON "payload"."_pages_v_blocks_hero_teaser" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_teaser_path_idx" ON "payload"."_pages_v_blocks_hero_teaser" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "payload"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_tenant_idx" ON "payload"."_pages_v" USING btree ("version_tenant_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "payload"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "payload"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "payload"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "payload"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "payload"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "payload"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "payload"."_pages_v" USING btree ("latest");
  CREATE INDEX "pages__status_idx" ON "payload"."pages" USING btree ("_status");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."_pages_v_blocks_hero_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."_pages_v_blocks_hero_teaser" CASCADE;
  DROP TABLE "payload"."_pages_v" CASCADE;
  DROP INDEX "payload"."pages__status_idx";
  ALTER TABLE "payload"."pages_blocks_hero_teaser" ALTER COLUMN "headline_text" SET NOT NULL;
  ALTER TABLE "payload"."pages" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "payload"."pages" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "payload"."pages" DROP COLUMN "_status";
  DROP TYPE "payload"."enum_pages_status";
  DROP TYPE "payload"."enum__pages_v_blocks_hero_teaser_headline_font_size";
  DROP TYPE "payload"."enum__pages_v_blocks_hero_teaser_subheadline_font_size";
  DROP TYPE "payload"."enum__pages_v_blocks_hero_teaser_description_font_size";
  DROP TYPE "payload"."enum__pages_v_version_status";`)
}
