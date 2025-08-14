import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import ConvertButton from '../components/ConvertButton'

describe('ConvertButton', () => {
  it('renders button with correct label', () => {
    render(<ConvertButton onClick={() => {}} disabled={false} />)
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<ConvertButton onClick={() => {}} disabled={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
