import { DEFAULT_DURATIONS } from '@/constants/consts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getStoredPomodoroSeconds } from './settingsStorage'

describe('getStoredPomodoroSeconds', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns default when no storage', () => {
    vi.stubGlobal('localStorage', { getItem: () => null })
    expect(getStoredPomodoroSeconds()).toBe(DEFAULT_DURATIONS.pomodoro)
  })

  it('returns default when storage is invalid JSON', () => {
    vi.stubGlobal('localStorage', { getItem: () => 'not-json' })
    expect(getStoredPomodoroSeconds()).toBe(DEFAULT_DURATIONS.pomodoro)
  })

  it('returns stored value when valid', () => {
    const stored = JSON.stringify({ durations: { pomodoro: 1800 } })
    vi.stubGlobal('localStorage', { getItem: () => stored })
    expect(getStoredPomodoroSeconds()).toBe(1800)
  })
})
