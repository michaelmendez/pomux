import { describe, expect, it } from 'vitest'
import { toAbsoluteUrl } from './url'

describe('toAbsoluteUrl', () => {
  it('creates absolute URL from relative path', () => {
    const result = toAbsoluteUrl('/api/data', 'https://example.com')
    expect(result).toBe('https://example.com/api/data')
  })

  it('uses globalThis.location.origin as default base', () => {
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { origin: 'https://default.com' },
      writable: true,
    })

    expect(toAbsoluteUrl('/path')).toBe('https://default.com/path')

    globalThis.location = originalLocation
  })
})
