import { renderHook, act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useLocalStorage from './useLocalStorage'

describe('useLocalStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns initial value on mount', () => {
    vi.stubGlobal('localStorage', { getItem: () => null })
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('updates storage when setValue called', () => {
    let storedValue: string | null = null
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: (_key: string, value: string) => { storedValue = value },
    })
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(storedValue).toBe('"new-value"')
    expect(result.current[0]).toBe('new-value')
  })

  it('supports functional updates', () => {
    let storedValue: string | null = null
    vi.stubGlobal('localStorage', {
      getItem: () => JSON.stringify('initial'),
      setItem: (_key: string, value: string) => { storedValue = value },
    })
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      result.current[1]((prev: string) => prev + '-updated')
    })

    expect(storedValue).toBe('"initial-updated"')
    expect(result.current[0]).toBe('initial-updated')
  })

  it('removeValue clears storage', () => {
    let removedKey: string | null = null
    vi.stubGlobal('localStorage', {
      getItem: () => JSON.stringify('value'),
      removeItem: (key: string) => { removedKey = key },
    })
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      result.current[2]()
    })

    expect(removedKey).toBe('test-key')
  })
})
