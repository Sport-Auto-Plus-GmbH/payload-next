import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_corporate_identity_video_teaser_headline_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
  CREATE TYPE "payload"."enum_corporate_identity_video_teaser_subheadline_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "headline_tag" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "headline_color" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "headline_font_size" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "subheadline_tag" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "subheadline_color" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "subheadline_font_size" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_overlay_color" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_play_button_background_color" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_play_button_text_color" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_play_button_radius" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_lightbox_frame_color" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_lightbox_frame_width" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_lightbox_radius" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "youtube_consent_required" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "youtube_consent_text" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "youtube_consent_button_label" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "headline_tag" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "headline_color" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "headline_font_size" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "subheadline_tag" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "subheadline_color" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "subheadline_font_size" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_overlay_color" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_play_button_background_color" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_play_button_text_color" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_play_button_radius" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_lightbox_frame_color" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_lightbox_frame_width" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_lightbox_radius" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "youtube_consent_required" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "youtube_consent_text" DROP DEFAULT;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "youtube_consent_button_label" DROP DEFAULT;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ADD COLUMN "design_lightbox_backdrop_color" varchar;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ADD COLUMN "design_lightbox_max_width" varchar;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ADD COLUMN "design_lightbox_backdrop_color" varchar;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ADD COLUMN "design_lightbox_max_width" varchar;
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_headline_tag" "payload"."enum_corporate_identity_video_teaser_headline_tag" DEFAULT 'h2';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_headline_color" varchar DEFAULT '#FFFFFF';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_headline_font_size" varchar DEFAULT 'clamp(1.8rem, 4.5vw, 4.4rem)';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_subheadline_tag" "payload"."enum_corporate_identity_video_teaser_subheadline_tag" DEFAULT 'h3';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_subheadline_color" varchar DEFAULT '#E94E1D';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_subheadline_font_size" varchar DEFAULT 'clamp(1.4rem, 3.2vw, 4rem)';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_design_overlay_color" varchar DEFAULT 'rgba(0, 0, 0, 0.24)';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_design_play_button_background_color" varchar DEFAULT 'rgba(63, 64, 66, 0.9)';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_design_play_button_text_color" varchar DEFAULT '#FFFFFF';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_design_play_button_radius" varchar DEFAULT '18px';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_design_lightbox_backdrop_color" varchar DEFAULT 'rgba(0, 0, 0, 0.8)';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_design_lightbox_frame_color" varchar DEFAULT '#FFFFFF';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_design_lightbox_frame_width" varchar DEFAULT '2px';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_design_lightbox_max_width" varchar DEFAULT '80rem';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_design_lightbox_radius" varchar DEFAULT '14px';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_youtube_consent_required" boolean DEFAULT true;
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_youtube_consent_text" varchar DEFAULT 'Zum Laden des YouTube-Videos wird eine Verbindung zu YouTube aufgebaut.';
  ALTER TABLE "payload"."corporate_identity" ADD COLUMN "video_teaser_youtube_consent_button_label" varchar DEFAULT 'Video laden';

  -- Blocks written before this migration contain Payload's former database defaults.
  -- Clear only complete, unchanged groups so they correctly inherit the new CI defaults.
  UPDATE "payload"."pages_blocks_video_teaser"
  SET "headline_tag" = NULL, "headline_color" = NULL, "headline_font_size" = NULL
  WHERE "headline_tag" = 'h2' AND "headline_color" = '#FFFFFF' AND "headline_font_size" = 'clamp(1.8rem, 4.5vw, 4.4rem)';
  UPDATE "payload"."pages_blocks_video_teaser"
  SET "subheadline_tag" = NULL, "subheadline_color" = NULL, "subheadline_font_size" = NULL
  WHERE "subheadline_tag" = 'h3' AND "subheadline_color" = '#E94E1D' AND "subheadline_font_size" = 'clamp(1.4rem, 3.2vw, 4rem)';
  UPDATE "payload"."pages_blocks_video_teaser"
  SET "design_overlay_color" = NULL, "design_play_button_background_color" = NULL, "design_play_button_text_color" = NULL, "design_play_button_radius" = NULL, "design_lightbox_frame_color" = NULL, "design_lightbox_frame_width" = NULL, "design_lightbox_radius" = NULL
  WHERE "design_overlay_color" = 'rgba(0, 0, 0, 0.24)' AND "design_play_button_background_color" = 'rgba(63, 64, 66, 0.9)' AND "design_play_button_text_color" = '#FFFFFF' AND "design_play_button_radius" = '18px' AND "design_lightbox_frame_color" = '#FFFFFF' AND "design_lightbox_frame_width" = '2px' AND "design_lightbox_radius" = '14px';
  UPDATE "payload"."pages_blocks_video_teaser"
  SET "youtube_consent_required" = NULL, "youtube_consent_text" = NULL, "youtube_consent_button_label" = NULL
  WHERE "youtube_consent_required" = true AND "youtube_consent_text" = 'Zum Laden des YouTube-Videos wird eine Verbindung zu YouTube aufgebaut.' AND "youtube_consent_button_label" = 'Video laden';
  UPDATE "payload"."_pages_v_blocks_video_teaser"
  SET "headline_tag" = NULL, "headline_color" = NULL, "headline_font_size" = NULL
  WHERE "headline_tag" = 'h2' AND "headline_color" = '#FFFFFF' AND "headline_font_size" = 'clamp(1.8rem, 4.5vw, 4.4rem)';
  UPDATE "payload"."_pages_v_blocks_video_teaser"
  SET "subheadline_tag" = NULL, "subheadline_color" = NULL, "subheadline_font_size" = NULL
  WHERE "subheadline_tag" = 'h3' AND "subheadline_color" = '#E94E1D' AND "subheadline_font_size" = 'clamp(1.4rem, 3.2vw, 4rem)';
  UPDATE "payload"."_pages_v_blocks_video_teaser"
  SET "design_overlay_color" = NULL, "design_play_button_background_color" = NULL, "design_play_button_text_color" = NULL, "design_play_button_radius" = NULL, "design_lightbox_frame_color" = NULL, "design_lightbox_frame_width" = NULL, "design_lightbox_radius" = NULL
  WHERE "design_overlay_color" = 'rgba(0, 0, 0, 0.24)' AND "design_play_button_background_color" = 'rgba(63, 64, 66, 0.9)' AND "design_play_button_text_color" = '#FFFFFF' AND "design_play_button_radius" = '18px' AND "design_lightbox_frame_color" = '#FFFFFF' AND "design_lightbox_frame_width" = '2px' AND "design_lightbox_radius" = '14px';
  UPDATE "payload"."_pages_v_blocks_video_teaser"
  SET "youtube_consent_required" = NULL, "youtube_consent_text" = NULL, "youtube_consent_button_label" = NULL
  WHERE "youtube_consent_required" = true AND "youtube_consent_text" = 'Zum Laden des YouTube-Videos wird eine Verbindung zu YouTube aufgebaut.' AND "youtube_consent_button_label" = 'Video laden';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "headline_tag" SET DEFAULT 'h2';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "headline_color" SET DEFAULT '#FFFFFF';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "headline_font_size" SET DEFAULT 'clamp(1.8rem, 4.5vw, 4.4rem)';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "subheadline_tag" SET DEFAULT 'h3';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "subheadline_color" SET DEFAULT '#E94E1D';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "subheadline_font_size" SET DEFAULT 'clamp(1.4rem, 3.2vw, 4rem)';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_overlay_color" SET DEFAULT 'rgba(0, 0, 0, 0.24)';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_play_button_background_color" SET DEFAULT 'rgba(63, 64, 66, 0.9)';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_play_button_text_color" SET DEFAULT '#FFFFFF';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_play_button_radius" SET DEFAULT '18px';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_lightbox_frame_color" SET DEFAULT '#FFFFFF';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_lightbox_frame_width" SET DEFAULT '2px';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "design_lightbox_radius" SET DEFAULT '14px';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "youtube_consent_required" SET DEFAULT true;
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "youtube_consent_text" SET DEFAULT 'Zum Laden des YouTube-Videos wird eine Verbindung zu YouTube aufgebaut.';
  ALTER TABLE "payload"."pages_blocks_video_teaser" ALTER COLUMN "youtube_consent_button_label" SET DEFAULT 'Video laden';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "headline_tag" SET DEFAULT 'h2';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "headline_color" SET DEFAULT '#FFFFFF';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "headline_font_size" SET DEFAULT 'clamp(1.8rem, 4.5vw, 4.4rem)';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "subheadline_tag" SET DEFAULT 'h3';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "subheadline_color" SET DEFAULT '#E94E1D';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "subheadline_font_size" SET DEFAULT 'clamp(1.4rem, 3.2vw, 4rem)';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_overlay_color" SET DEFAULT 'rgba(0, 0, 0, 0.24)';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_play_button_background_color" SET DEFAULT 'rgba(63, 64, 66, 0.9)';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_play_button_text_color" SET DEFAULT '#FFFFFF';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_play_button_radius" SET DEFAULT '18px';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_lightbox_frame_color" SET DEFAULT '#FFFFFF';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_lightbox_frame_width" SET DEFAULT '2px';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "design_lightbox_radius" SET DEFAULT '14px';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "youtube_consent_required" SET DEFAULT true;
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "youtube_consent_text" SET DEFAULT 'Zum Laden des YouTube-Videos wird eine Verbindung zu YouTube aufgebaut.';
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" ALTER COLUMN "youtube_consent_button_label" SET DEFAULT 'Video laden';
  ALTER TABLE "payload"."pages_blocks_video_teaser" DROP COLUMN "design_lightbox_backdrop_color";
  ALTER TABLE "payload"."pages_blocks_video_teaser" DROP COLUMN "design_lightbox_max_width";
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" DROP COLUMN "design_lightbox_backdrop_color";
  ALTER TABLE "payload"."_pages_v_blocks_video_teaser" DROP COLUMN "design_lightbox_max_width";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_headline_tag";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_headline_color";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_headline_font_size";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_subheadline_tag";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_subheadline_color";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_subheadline_font_size";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_design_overlay_color";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_design_play_button_background_color";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_design_play_button_text_color";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_design_play_button_radius";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_design_lightbox_backdrop_color";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_design_lightbox_frame_color";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_design_lightbox_frame_width";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_design_lightbox_max_width";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_design_lightbox_radius";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_youtube_consent_required";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_youtube_consent_text";
  ALTER TABLE "payload"."corporate_identity" DROP COLUMN "video_teaser_youtube_consent_button_label";
  DROP TYPE "payload"."enum_corporate_identity_video_teaser_headline_tag";
  DROP TYPE "payload"."enum_corporate_identity_video_teaser_subheadline_tag";`)
}
