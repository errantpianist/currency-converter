import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import ErrorMessage from '../components/ErrorMessage'

describe('ErrorMessage', () => {
  it('renders error message when message prop is set', () => {
    render(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
  })

  it('renders nothing when message prop is empty', () => {
    const { container } = render(<ErrorMessage message="" />)
    expect(container).toBeEmptyDOMElement()
  })
})
