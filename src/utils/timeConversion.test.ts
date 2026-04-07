import { toMinutes, toSeconds } from '@/utils/timeConversion'
import { describe, expect, it } from 'vitest'

describe('timeConversion', () => {
  it('converts seconds to rounded minutes', () => {
    expect(toMinutes(0)).toBe(0)
    expect(toMinutes(30)).toBe(1)
    expect(toMinutes(60)).toBe(1)
    expect(toMinutes(90)).toBe(2)
  })

  it('converts minutes to seconds', () => {
    expect(toSeconds(0)).toBe(0)
    expect(toSeconds(1)).toBe(60)
    expect(toSeconds(5)).toBe(300)
  })
})
