// Any setup scripts you might need go here

// Load .env.test (not .env) — integration tests run against their own dedicated schema
// (DATABASE_SCHEMA=payload_test), never the dev server's schema and its seeded demo data.
import { config } from 'dotenv'

config({ path: '.env.test' })

// Unmount rendered components between tests — without this, multiple tests calling
// `render()` in the same file leak elements into jsdom's shared document, breaking
// single-element queries like `getByText` on the second/third test.
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
