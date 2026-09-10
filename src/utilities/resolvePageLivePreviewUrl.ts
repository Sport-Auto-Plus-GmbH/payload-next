/**
 * Computes the Website URL Live Preview should load for a Pages document, based on
 * its current (possibly unsaved) `slug`. The homepage route is `/`; anything else
 * assumes website-next has (or will have) a matching `/<slug>` route — see
 * .ai/cms/GLOBALS.md's Live Preview section.
 */
export function resolvePageLivePreviewUrl(frontendUrl: string, slug: string | undefined): string {
  const path = !slug || slug === 'home' ? '/' : `/${slug}`
  return `${frontendUrl}${path}`
}
