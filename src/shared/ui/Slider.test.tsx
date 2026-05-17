import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Slider from './Slider'

describe('Slider', () => {
  it('calls onChange with new value', () => {
    const handleChange = vi.fn()
    render(<Slider value={50} onChange={handleChange} min={0} max={100} />)

    const input = screen.getByRole('slider')
    fireEvent.change(input, { target: { value: '75' } })

    expect(handleChange).toHaveBeenCalledWith(75)
  })

  it('displays formatted value', () => {
    render(<Slider value={75} valueFormatter={(v) => `${v}%`} showValueBubble />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('respects min/max props', () => {
    render(<Slider value={50} min={10} max={90} />)
    const input = screen.getByRole('slider')
    expect(input).toHaveAttribute('min', '10')
    expect(input).toHaveAttribute('max', '90')
  })
})
