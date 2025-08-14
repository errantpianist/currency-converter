import React from 'react'


interface AmountInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  focusTrigger?: number
}


const AmountInput: React.FC<AmountInputProps> = ({ 
  value, 
  onChange,
  error,
  focusTrigger
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (focusTrigger && inputRef.current) {
      const input = inputRef.current
      input.focus()
      // Move cursor to end
      const length = input.value.length
      input.setSelectionRange(length, length)
    }
  }, [focusTrigger])

  return (
    <div className="mb-6">
      <label htmlFor="amount" className="block mb-2 font-semibold text-gray-700">Amount</label>
      <input
        ref={inputRef}
        id="amount"
        type="text"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        placeholder="Enter amount"
        autoComplete="off"
        aria-label="Amount to convert"
        aria-invalid={!!error}
        aria-describedby={error ? 'amount-error' : undefined}
        className={`w-full px-4 py-3 border-2 rounded-md text-lg transition-colors focus:outline-none focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p id="amount-error" className="text-red-500 text-sm mt-2" aria-live="polite">{error}</p>}
    </div>
  )
}

export default AmountInput