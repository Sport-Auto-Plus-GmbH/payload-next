import type { ServerProps } from 'payload'

// Static copy of the same asset vendored in website-next/public/cd/logo — used only if
// the corporate-identity global has no logo set yet (e.g. a fresh, unseeded database).
const FALLBACK_LOGO_URL = '/cd/logo/sport-auto-plus-logo.svg'

export default async function Logo({ payload }: ServerProps) {
  const { logo } = await payload.findGlobal({ slug: 'corporate-identity' })
  const logoUrl = logo && typeof logo === 'object' ? logo.url : null

  return (
    <div className="flex flex-col items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny branding asset, not worth next/image's config for a single admin-only logo */}
      <img src={logoUrl || FALLBACK_LOGO_URL} alt="Sport Auto Plus" className="h-30 w-auto" />
      <span className="text-xl tracking-wide text-[var(--theme-elevation-500)] uppercase">
        Payload CMS
      </span>
    </div>
  )
}
