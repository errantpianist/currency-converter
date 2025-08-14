import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import ResultDisplay from '../components/ResultDisplay'

describe('ResultDisplay', () => {
  it('renders conversion result when result is not null', () => {
    render(
      <ResultDisplay
        baseCurrency="USD"
        targetCurrency="EUR"
        amount="100"
        result={123.45}
      />
    )
    expect(screen.getByText(/USD.*EUR/i)).toBeInTheDocument()
    expect(screen.getByText(/123.45/)).toBeInTheDocument()
  })

  it('renders nothing when result is null', () => {
    const { container } = render(
      <ResultDisplay
        baseCurrency="USD"
        targetCurrency="EUR"
        amount="100"
        result={null}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
