
import React from 'react'

interface ResultDisplayProps {
  baseCurrency: string
  targetCurrency: string
  amount: string
  result: number | null
  lastUpdated?: number | null
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  baseCurrency,
  targetCurrency,
  amount,
  result,
  lastUpdated
}) => {
  if (result === null) return null

  // Format input amount and result as currency with 2 decimals
  const parsedAmount = parseFloat(amount.endsWith('.') ? amount.slice(0, -1) : amount)
  const formattedAmount = isNaN(parsedAmount)
    ? amount
    : new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(parsedAmount)
  const formattedResult = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(result)

  // Calculate exchange rates
  const rate = parsedAmount === 0 || isNaN(parsedAmount) ? null : result / parsedAmount
  const reciprocalRate = rate ? 1 / rate : null
  const formattedRate = rate ? rate.toFixed(6) : '--'
  const formattedReciprocal = reciprocalRate ? reciprocalRate.toFixed(6) : '--'

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-md text-center shadow">
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-600 mb-1">
          {formattedAmount} {baseCurrency} =
        </div>
        <div className="text-3xl font-extrabold text-blue-800 mb-2" data-testid="conversion-result">
         {formattedResult} {targetCurrency}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          1 {baseCurrency} = {formattedRate} {targetCurrency}
        </div>
        <div className="text-sm text-gray-700">
          1 {targetCurrency} = {formattedReciprocal} {baseCurrency}
        </div>
        {lastUpdated && (
          <div className="text-xs text-gray-500 mt-4" data-testid="last-updated">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultDisplay