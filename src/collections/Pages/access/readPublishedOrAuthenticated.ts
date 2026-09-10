import type { Access } from 'payload'

/**
 * Pages-specific override of the shared `readAccess` (public/unauthenticated): now that
 * Pages has `versions.drafts`, an unauthenticated request (the Website's own server-side
 * fetch, any anonymous visitor) MUST only ever see published pages — an editor's draft is
 * not read here at all. Payload's drafts feature does NOT filter this automatically; it
 * has to be done in access control (https://payloadcms.com/docs/versions/drafts#access-control).
 *
 * An authenticated request (Payload's own admin UI) still sees everything, matching the
 * pre-drafts behavior — this only narrows the previously fully-public read down for the
 * unauthenticated case specifically.
 */
export const readPublishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) {
    return true
  }

  return { _status: { equals: 'published' } }
}
