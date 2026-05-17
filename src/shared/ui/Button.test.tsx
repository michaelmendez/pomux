import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled()
  })

  it('calls onClick when clicked', async () => {
    const handleButtonClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleButtonClick}>Click me</Button>)

    await user.click(screen.getByRole('button', { name: /click me/i }))
    expect(handleButtonClick).toHaveBeenCalledTimes(1)
  })
})
