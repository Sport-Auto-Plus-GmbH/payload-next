import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_media_source_type" AS ENUM('upload', 'youtube');
  CREATE TYPE "payload"."enum_pages_blocks_video_teaser_headline_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
  CREATE TYPE "payload"."enum_pages_blocks_video_teaser_subheadline_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
  CREATE TYPE "payload"."enum__pages_v_blocks_video_teaser_headline_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
  CREATE TYPE "payload"."enum__pages_v_blocks_video_teaser_subheadline_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
  CREATE TABLE "payload"."pages_blocks_video_teaser" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"headline_text" varchar,
	"headline_tag" "payload"."enum_pages_blocks_video_teaser_headline_tag" DEFAULT 'h2',
	"headline_color" varchar DEFAULT '#FFFFFF',
	"headline_font_size" varchar DEFAULT 'clamp(1.8rem, 4.5vw, 4.4rem)',
	"subheadline_text" varchar,
	"subheadline_tag" "payload"."enum_pages_blocks_video_teaser_subheadline_tag" DEFAULT 'h3',
	"subheadline_color" varchar DEFAULT '#E94E1D',
	"subheadline_font_size" varchar DEFAULT 'clamp(1.4rem, 3.2vw, 4rem)',
	"duration_label" varchar,
	"teaser_media_id" integer,
	"video_media_id" integer,
	"design_overlay_color" varchar DEFAULT 'rgba(0, 0, 0, 0.24)',
	"design_play_button_background_color" varchar DEFAULT 'rgba(63, 64, 66, 0.9)',
	"design_play_button_text_color" varchar DEFAULT '#FFFFFF',
	"design_play_button_radius" varchar DEFAULT '18px',
	"design_lightbox_frame_color" varchar DEFAULT '#FFFFFF',
	"design_lightbox_frame_width" varchar DEFAULT '2px',
	"design_lightbox_radius" varchar DEFAULT '14px',
	"youtube_consent_required" boolean DEFAULT true,
	"youtube_consent_text" varchar DEFAULT 'Zum Laden des YouTube-Videos wird eine Verbindung zu YouTube aufgebaut.',
	"youtube_consent_button_label" varchar DEFAULT 'Video laden',
	"block_name" varchar
  );

  CREATE TABLE "payload"."_pages_v_blocks_video_teaser" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"headline_text" varchar,
	"headline_tag" "payload"."enum__pages_v_blocks_video_teaser_headline_tag" DEFAULT 'h2',
	"headline_color" varchar DEFAULT '#FFFFFF',
	"headline_font_size" varchar DEFAULT 'clamp(1.8rem, 4.5vw, 4.4rem)',
	"subheadline_text" varchar,
	"subheadline_tag" "payload"."enum__pages_v_blocks_video_teaser_subheadline_tag" DEFAULT 'h3',
	"subheadline_color" varchar DEFAULT '#E94E1D',
	"subheadline_font_size" varchar DEFAULT 'clamp(1.4rem, 3.2vw, 4rem)',
	"duration_label" varchar,
	"teaser_media_id" integer,
	"video_media_id" integer,
	"design_overlay_color" varchar DEFAULT 'rgba(0, 0, 0, 0.24)',
	"design_play_button_background_color" varchar DEFAULT 'rgba(63, 64, 66, 0.9)',
	"design_play_button_text_color" varchar DEFAULT '#FFFFFF',
	"design_play_button_radius" varchar DEFAULT '18px',
	"design_lightbox_frame_color" varchar DEFAULT '#FFFFFF',
	"design_lightbox_frame_width" varchar DEFAULT '2px',
	"design_lightbox_radius" varchar DEFAULT '14px',
	"youtube_consent_required" boolean DEFAULT true,
	"youtube_consent_text" varchar DEFAULT 'Zum Laden des YouTube-Videos wird eine Verbindung zu YouTube aufgebaut.',
	"youtube_consent_button_label" varchar DEFAULT 'Video laden',
	"_uuid" varchar,
	"block_name" varchar
  );

  ALTER TABLE "payload"."media" ADD COLUMN "source_type" "payload"."enum_media_source_type" DEFAULT 'upload' NOT NULL;
  ALTER TABLE "payload"."media" ADD COLUMN "youtube_url" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "video_thumbnail_id" integer;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ADD CONSTRAINT "pages_blocks_video_teaser_teaser_media_id_media_id_fk" FOREIGN KEY ("teaser_media_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ADD CONSTRAINT "pages_blocks_video_teaser_video_media_id_media_id_fk" FOREIGN KEY ("video_media_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ADD CONSTRAINT "pages_blocks_video_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ADD CONSTRAINT "_pages_v_blocks_video_teaser_teaser_media_id_media_id_fk" FOREIGN KEY ("teaser_media_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ADD CONSTRAINT "_pages_v_blocks_video_teaser_video_media_id_media_id_fk" FOREIGN KEY ("video_media_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ADD CONSTRAINT "_pages_v_blocks_video_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_video_teaser_order_idx" ON "payload"."pages_blocks_video_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_teaser_parent_id_idx" ON "payload"."pages_blocks_video_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_teaser_path_idx" ON "payload"."pages_blocks_video_teaser" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_teaser_teaser_media_idx" ON "payload"."pages_blocks_video_teaser" USING btree ("teaser_media_id");
  CREATE INDEX "pages_blocks_video_teaser_video_media_idx" ON "payload"."pages_blocks_video_teaser" USING btree ("video_media_id");
  CREATE INDEX "_pages_v_blocks_video_teaser_order_idx" ON "payload"."_pages_v_blocks_video_teaser" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_teaser_parent_id_idx" ON "payload"."_pages_v_blocks_video_teaser" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_teaser_path_idx" ON "payload"."_pages_v_blocks_video_teaser" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_teaser_teaser_media_idx" ON "payload"."_pages_v_blocks_video_teaser" USING btree ("teaser_media_id");
  CREATE INDEX "_pages_v_blocks_video_teaser_video_media_idx" ON "payload"."_pages_v_blocks_video_teaser" USING btree ("video_media_id");
  ALTER TABLE "payload"."media" ADD CONSTRAINT "media_video_thumbnail_id_media_id_fk" FOREIGN KEY ("video_thumbnail_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_video_thumbnail_idx" ON "payload"."media" USING btree ("video_thumbnail_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."pages_blocks_video_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."pages_blocks_video_teaser" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_video_teaser" CASCADE;
  ALTER TABLE "payload"."media" DROP CONSTRAINT "media_video_thumbnail_id_media_id_fk";

  DROP INDEX "payload"."media_video_thumbnail_idx";
  ALTER TABLE "payload"."media" DROP COLUMN "source_type";
  ALTER TABLE "payload"."media" DROP COLUMN "youtube_url";
  ALTER TABLE "payload"."media" DROP COLUMN "video_thumbnail_id";
  DROP TYPE "payload"."enum_media_source_type";
  DROP TYPE "payload"."enum_pages_blocks_video_teaser_headline_tag";
  DROP TYPE "payload"."enum_pages_blocks_video_teaser_subheadline_tag";
  DROP TYPE "payload"."enum__pages_v_blocks_video_teaser_headline_tag";
  DROP TYPE "payload"."enum__pages_v_blocks_video_teaser_subheadline_tag";`)
}
