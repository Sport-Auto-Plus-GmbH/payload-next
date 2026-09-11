import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TABLE "payload"."redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"from" varchar NOT NULL,
  	"to_type" "payload"."enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  ALTER TABLE "payload"."pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "payload"."pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "payload"."pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "payload"."_pages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "payload"."_pages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "payload"."_pages_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "payload"."redirects" ADD CONSTRAINT "redirects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "payload"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "redirects_tenant_idx" ON "payload"."redirects" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "payload"."redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "payload"."redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "payload"."redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "payload"."redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "payload"."redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "payload"."redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "payload"."redirects_rels" USING btree ("pages_id");
  ALTER TABLE "payload"."pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "payload"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "payload"."pages" USING btree ("meta_image_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "payload"."_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("redirects_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."redirects_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."redirects" CASCADE;
  DROP TABLE "payload"."redirects_rels" CASCADE;
  ALTER TABLE "payload"."pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  
  ALTER TABLE "payload"."_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_redirects_fk";
  
  DROP INDEX "payload"."pages_meta_meta_image_idx";
  DROP INDEX "payload"."_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_redirects_id_idx";
  ALTER TABLE "payload"."pages" DROP COLUMN "meta_title";
  ALTER TABLE "payload"."pages" DROP COLUMN "meta_description";
  ALTER TABLE "payload"."pages" DROP COLUMN "meta_image_id";
  ALTER TABLE "payload"."_pages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "payload"."_pages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "payload"."_pages_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "redirects_id";
  DROP TYPE "payload"."enum_redirects_to_type";`)
}
