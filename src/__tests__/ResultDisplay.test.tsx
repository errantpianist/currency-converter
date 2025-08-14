import React from 'react'
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
  const resultLine = screen.getByTestId('conversion-result');
  expect(resultLine).toBeInTheDocument();
  expect(resultLine.textContent).toMatch(/123.45 EUR/);
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
