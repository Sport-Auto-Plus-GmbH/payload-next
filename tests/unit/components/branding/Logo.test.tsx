import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Payload, ServerProps } from 'payload'

import Logo from '@/components/branding/Logo'

function buildProps(logo: unknown): ServerProps {
  return {
    payload: {
      findGlobal: async () => ({ logo }),
    } as unknown as Payload,
  } as ServerProps
}

describe('Logo', () => {
  it('renders the CMS-provided logo when the global has one set', async () => {
    render(await Logo(buildProps({ url: '/api/media/file/sport-auto-plus-logo.svg' })))

    expect(screen.getByAltText('Sport Auto Plus')).toHaveProperty(
      'src',
      expect.stringContaining('/api/media/file/sport-auto-plus-logo.svg'),
    )
  })

  it('falls back to the static logo when the global has none set', async () => {
    render(await Logo(buildProps(null)))

    expect(screen.getByAltText('Sport Auto Plus')).toHaveProperty(
      'src',
      expect.stringContaining('/cd/logo/sport-auto-plus-logo.svg'),
    )
  })

  it('always renders the Payload CMS caption', async () => {
    render(await Logo(buildProps(null)))

    expect(screen.getByText('Payload CMS')).toBeTruthy()
  })
})
