import { SECONDS_PER_MINUTE } from '@/constants/consts'
import { formatTime } from '@/utils/formatTime'
import { describe, expect, it } from 'vitest'

describe('formatTime', () => {
  it('formats 0 seconds as "00:00"', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('formats 30 seconds as "00:30"', () => {
    expect(formatTime(30)).toBe('00:30')
  })

  it('formats 60 seconds as "01:00"', () => {
    expect(formatTime(60)).toBe('01:00')
  })

  it('formats 90 seconds as "01:30"', () => {
    expect(formatTime(90)).toBe('01:30')
  })

  it('formats 60 minutes as "60:00"', () => {
    expect(formatTime(SECONDS_PER_MINUTE * 60)).toBe('60:00')
  })

  it('formats 61 minutes 0 seconds as "61:00"', () => {
    expect(formatTime(SECONDS_PER_MINUTE * 61)).toBe('61:00')
  })

  it('formats 90 minutes as "90:00"', () => {
    expect(formatTime(SECONDS_PER_MINUTE * 90)).toBe('90:00')
  })
})
