
import React from 'react'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'

interface ResultDisplayProps {
  baseCurrency: string
  targetCurrency: string
  amount: string
  result: number | null
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  baseCurrency,
  targetCurrency,
  amount,
  result 
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

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-md text-center shadow">
      <h3 className="flex items-center justify-center text-xl font-bold text-blue-700 mb-2">
        <CurrencyDollarIcon className="w-5 h-5 text-blue-400 mr-2" />
        Conversion Result
      </h3>
  <p className="text-lg font-semibold text-gray-800 opacity-0 animate-[fadeIn_0.8s_ease-in_forwards]" data-testid="conversion-result">
        {formattedAmount} {baseCurrency} = {formattedResult} {targetCurrency}
      </p>
    </div>
  )
}

export default ResultDisplay