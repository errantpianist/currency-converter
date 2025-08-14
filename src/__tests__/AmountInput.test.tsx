import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import AmountInput from '../components/AmountInput'

describe('AmountInput', () => {
  it('renders label and input', () => {
    render(<AmountInput value="" onChange={() => {}} />)
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument()
  })

  it('shows error message when error prop is set', () => {
    render(<AmountInput value="" onChange={() => {}} error="Invalid amount" />)
    expect(screen.getByText(/Invalid amount/i)).toBeInTheDocument()
  })

  it('calls onChange when input changes', () => {
  const handleChange = vi.fn()
    render(<AmountInput value="" onChange={handleChange} />)
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '123' } })
    expect(handleChange).toHaveBeenCalled()
  })
})
