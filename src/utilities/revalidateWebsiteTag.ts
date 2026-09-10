import type { PayloadRequest } from 'payload'

/**
 * Notifies the Website's revalidation webhook so a cached fetch doesn't have to wait
 * out its `revalidate` window. Network/config failures are logged and swallowed —
 * the Payload write that triggered this already succeeded and must not be undone by
 * a webhook problem (see .ai/cms/HOOKS.md's "Idempotency and Safety").
 */
export async function revalidateWebsiteTag(tag: string, req: PayloadRequest): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001'
  const secret = process.env.REVALIDATE_SECRET

  if (!secret) {
    req.payload.logger.warn(`Skipping revalidation of "${tag}" — REVALIDATE_SECRET is not set.`)
    return
  }

  try {
    const response = await fetch(`${frontendUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ tag }),
    })

    if (!response.ok) {
      req.payload.logger.error(
        `Failed to revalidate "${tag}": Website responded with ${response.status}.`,
      )
    }
  } catch (error) {
    req.payload.logger.error({ err: error }, `Failed to revalidate "${tag}".`)
  }
}
