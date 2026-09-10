import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."corporate_identity" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"colors_primary" varchar DEFAULT '#E94E1D' NOT NULL,
  	"colors_secondary" varchar DEFAULT '#323E48' NOT NULL,
  	"colors_destructive" varchar DEFAULT '#990000' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."corporate_identity" ADD CONSTRAINT "corporate_identity_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "corporate_identity_logo_idx" ON "payload"."corporate_identity" USING btree ("logo_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."corporate_identity" CASCADE;`)
}
