import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  setBaseCurrency, 
  setTargetCurrency, 
  setAmount,
  setResult,
  clearResult,
  setError,
  clearError,
  fetchRates
} from './features/currencyConverter/currencySlice'
import type { RootState } from './store/store'
import type { AppDispatch } from './store/store'
import CurrencyDropdown from './components/CurrencyDropdown'
import AmountInput from './components/AmountInput'
import ConvertButton from './components/ConvertButton'
import ResultDisplay from './components/ResultDisplay'
import ErrorMessage from './components/ErrorMessage'
import ThemeToggle from './components/ThemeToggle'


const App: React.FC = () => {
  // Track theme in local state for ThemeToggle
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  // On initial load, set theme from localStorage or system preference
  useEffect(() => {
    const html = document.documentElement
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      html.classList.add('dark')
      setTheme('dark')
    } else if (saved === 'light') {
      html.classList.remove('dark')
      setTheme('light')
    } else {
      // Use system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark')
        setTheme('dark')
      } else {
        html.classList.remove('dark')
        setTheme('light')
      }
    }
    // Observe changes to the dark class
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Simple dark mode toggle
  const handleToggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setTheme('light')
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setTheme('dark')
    }
  }
  const dispatch = useDispatch<AppDispatch>()

  const {
    baseCurrency,
    targetCurrency,
    amount,
    result,
    rates,
    loading,
    error,
    currencyList,
    lastFetched
  } = useSelector((state: RootState) => state.currency)

  // Track if conversion has been triggered for current pair
  const [conversionTriggered, setConversionTriggered] = useState(false)
  // Used to trigger focus on AmountInput
  const [focusTrigger, setFocusTrigger] = useState(0)
  const prevPairRef = useRef<string>("")
  const justResetRef = useRef(false)

  // Get rates for the current base currency
  const currentRates = rates[baseCurrency] || {}
  const currencyCodes = currencyList
      // Swap base and target currencies
      const handleSwapCurrencies = () => {
        // If base and target are the same, do nothing
        if (baseCurrency === targetCurrency) return
        dispatch(setBaseCurrency(targetCurrency))
        dispatch(setTargetCurrency(baseCurrency))
      }
  const targetCurrencyOptions = currencyCodes.filter(code => code !== baseCurrency)

  // Helper to get current pair key
  const getPairKey = () => `${baseCurrency}_${targetCurrency}`

  // Reset conversion trigger and result when currency pair changes
  useEffect(() => {
    dispatch(fetchRates(baseCurrency))
    dispatch(clearResult())
    setConversionTriggered(false)
    justResetRef.current = true
    prevPairRef.current = getPairKey()
  }, [dispatch, baseCurrency, targetCurrency])

  // Validate amount: only allow positive numbers, max 2 decimals
  const validateAmount = (): string => {
  if (!amount) return ''
  let validateValue = amount.endsWith('.') ? amount.slice(0, -1) : amount
  // Allow negative sign in input, but catch in error logic
  const num = parseFloat(validateValue)
  if (isNaN(num)) return 'Please enter a valid number'
  if (num <= 0) return 'Amount must be greater than zero'
  if (num > 1000000000) return 'Maximum allowed amount is 1,000,000,000'
  // Accept negative sign in input, but only positive numbers with up to 2 decimals are valid
  if (!/^(-?\d+)?(\.\d{1,2})?$/.test(validateValue)) return 'Maximum 2 decimal places allowed'
  return ''
  }

  const amountError = validateAmount()

  // Clear API error when amountError is cleared
  useEffect(() => {
    if (!amountError && error) {
      dispatch(clearError())
    }
  }, [amountError, error, dispatch])

  // Real-time conversion only if triggered for current pair and rates are loaded
  useEffect(() => {
    // If amount becomes empty or invalid, reset conversionTriggered and clear result
    if (!amount || amountError) {
      setConversionTriggered(false)
      dispatch(clearResult())
      if (amountError) dispatch(setError(amountError))
      return
    }
    if (!conversionTriggered) return
    if (justResetRef.current) {
      justResetRef.current = false
      return
    }
    if (loading) return // Wait for rates to load
    dispatch(clearError())
    const num = parseFloat(amount)
    const rate = currentRates[targetCurrency]?.rate
    if (rate) {
      const convertedAmount = num * rate
      dispatch(setResult(convertedAmount))
    } else {
      dispatch(setError('Exchange rate not available'))
    }
  }, [amount, conversionTriggered, baseCurrency, targetCurrency, currentRates, amountError, loading, dispatch])

  // Convert button handler: trigger conversion for current pair
  const handleConvert = () => {
    setConversionTriggered(true)
    setFocusTrigger(focusTrigger + 1)
    dispatch(clearError())
    const error = validateAmount()
    if (loading) return // Wait for rates to load
    if (!amount || error) {
      dispatch(clearResult())
      if (error) dispatch(setError(error))
      return
    }
    const num = parseFloat(amount)
    const rate = currentRates[targetCurrency]?.rate
    if (rate) {
      const convertedAmount = num * rate
      dispatch(setResult(convertedAmount))
    } else {
      dispatch(setError('Exchange rate not available'))
    }
  }

  return (
  <div className="min-h-screen w-full flex justify-center bg-gradient-to-br from-[#23395d] via-[#1e3a5c] to-[#3b5998] bg-fixed pt-8 pb-8 sm:pt-32 sm:pb-32">
      <div
        className={
          `sm:max-w-xl max-w-sm w-full mx-auto px-4 py-8 rounded-lg shadow-lg ` +
          `bg-white/90 dark:bg-gray-900/90 overflow-hidden sm:overflow-auto`
        }
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-white">Currency Converter</h1>
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
        </div>

        {loading && (
          <div className="flex items-center justify-center mb-4">
            <svg className="animate-spin h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-blue-500 font-medium">Loading exchange rates...</span>
          </div>
        )}

        {/* Show API error in ErrorMessage banner, only if there is an API error and no amount error */}
        {error && !amountError && (
          <ErrorMessage message={error} />
        )}

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <CurrencyDropdown
              label="Base Currency"
              value={baseCurrency}
              onChange={(value) => dispatch(setBaseCurrency(value))}
              options={currencyCodes}
              disabled={loading}
              isDark={theme === 'dark'}
            />
          </div>
          <button
            type="button"
            aria-label="Swap currencies"
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 w-10 h-10 flex items-center justify-center shadow transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleSwapCurrencies}
            disabled={loading || baseCurrency === targetCurrency}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 7l4-4m-4 4l4 4M20 17H4m16 0l-4-4m4 4l-4 4" />
            </svg>
          </button>
          <div className="flex-1">
            <CurrencyDropdown
              label="Target Currency"
              value={targetCurrency}
              onChange={(value) => dispatch(setTargetCurrency(value))}
              options={targetCurrencyOptions}
              disabled={loading}
              isDark={theme === 'dark'}
            />
          </div>
        </div>

        <AmountInput
          value={amount}
          onChange={(event) => {
            const val = event.target.value
            // Allow leading minus sign, digits, and up to 2 decimals
            if (/^-?\d*(\.\d{0,2})?$/.test(val) || val === '' || /^-?\d+\.$/.test(val)) {
              dispatch(setAmount(val))
            }
          }}
          error={amountError}
          focusTrigger={focusTrigger}
          onEnter={handleConvert}
        />

        <ConvertButton
          onClick={handleConvert}
          disabled={!!amountError || loading || !amount || conversionTriggered}
        />

        {conversionTriggered && (
          <ResultDisplay
            baseCurrency={baseCurrency}
            targetCurrency={targetCurrency}
            amount={amount}
            result={result}
            lastUpdated={lastFetched[baseCurrency] || null}
          />
        )}
      </div>
    </div>
  )
}

export default App