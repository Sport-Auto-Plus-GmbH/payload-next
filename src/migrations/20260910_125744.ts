import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_pages_blocks_hero_teaser_headline_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TYPE "payload"."enum_pages_blocks_hero_teaser_subheadline_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TYPE "payload"."enum_pages_blocks_hero_teaser_description_font_size" AS ENUM('sm', 'md', 'lg', 'xl', '2xl');
  CREATE TABLE "payload"."pages_blocks_hero_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline_text" varchar NOT NULL,
  	"headline_font_size" "payload"."enum_pages_blocks_hero_teaser_headline_font_size" DEFAULT 'md',
  	"headline_color" varchar DEFAULT '#323E48',
  	"subheadline_text" varchar,
  	"subheadline_font_size" "payload"."enum_pages_blocks_hero_teaser_subheadline_font_size" DEFAULT 'md',
  	"subheadline_color" varchar DEFAULT '#323E48',
  	"description_text" varchar,
  	"description_font_size" "payload"."enum_pages_blocks_hero_teaser_description_font_size" DEFAULT 'md',
  	"description_color" varchar DEFAULT '#323E48',
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload"."pages_blocks_hero_teaser" ADD CONSTRAINT "pages_blocks_hero_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "payload"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_teaser_order_idx" ON "payload"."pages_blocks_hero_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_teaser_parent_id_idx" ON "payload"."pages_blocks_hero_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_teaser_path_idx" ON "payload"."pages_blocks_hero_teaser" USING btree ("_path");
  CREATE INDEX "pages_tenant_idx" ON "payload"."pages" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "payload"."pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "payload"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "payload"."pages" USING btree ("created_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pages_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."pages_blocks_hero_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."pages_blocks_hero_teaser" CASCADE;
  DROP TABLE "payload"."pages" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "pages_id";
  DROP TYPE "payload"."enum_pages_blocks_hero_teaser_headline_font_size";
  DROP TYPE "payload"."enum_pages_blocks_hero_teaser_subheadline_font_size";
  DROP TYPE "payload"."enum_pages_blocks_hero_teaser_description_font_size";`)
}
