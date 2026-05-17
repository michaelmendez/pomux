import { describe, expect, it } from 'vitest'
import { toHttps } from './toHttps'

describe('toHttps', () => {
  it('converts http:// to https://', () => {
    expect(toHttps('http://example.com')).toBe('https://example.com')
  })

  it('returns undefined when input is undefined', () => {
    expect(toHttps(undefined)).toBeUndefined()
  })

  it('returns unchanged when already https://', () => {
    expect(toHttps('https://example.com')).toBe('https://example.com')
  })
})
