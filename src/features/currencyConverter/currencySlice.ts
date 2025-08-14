import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchExchangeRates } from './currencyAPI'

// Types
export interface ExchangeRate {
  code: string
  rate: number
}

export interface CurrencyState {
  baseCurrency: string
  targetCurrency: string
  amount: string
  result: number | null
  rates: Record<string, Record<string, ExchangeRate>> // baseCurrency -> rates
  loading: boolean
  error: string | null
  lastFetched: Record<string, number>
  currencyList: string[]
}

// Initial State
const initialState: CurrencyState = {
  baseCurrency: 'GBP',
  targetCurrency: 'USD',
  amount: '',
  result: null,
  rates: {},
  loading: false,
  error: null,
  lastFetched: {},
  currencyList: []
}

// Async Thunk for fetching exchange rates
export const fetchRates = createAsyncThunk(
  'currency/fetchRates',
  async (baseCurrency: string, { getState, rejectWithValue }) => {
    const { currency } = getState() as { currency: CurrencyState }
    const lastFetchTime = currency.lastFetched[baseCurrency]
    const currentTime = Date.now()
    const CACHE_DURATION = 60000 // 1 minute

    // Check if we have cached rates for this baseCurrency
    if (
      lastFetchTime &&
      (currentTime - lastFetchTime < CACHE_DURATION) &&
      currency.rates[baseCurrency]
    ) {
      console.log('Using cached rates for', baseCurrency)
      return {
        baseCurrency,
        rates: currency.rates[baseCurrency],
        timestamp: lastFetchTime
      }
    }
    try {
        const rates = await fetchExchangeRates(baseCurrency)
        return {
            baseCurrency,
            rates,
            timestamp: currentTime
        }
    }
    catch (error) {
        let errorMessage = 'Failed to fetch exchange rates'
        if (error instanceof Error) {
            errorMessage = error.message
        }
        return rejectWithValue(errorMessage)
    }
}
)

// Slice
const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setBaseCurrency: (state, action: PayloadAction<string>) => {
      state.baseCurrency = action.payload
    },
    setTargetCurrency: (state, action: PayloadAction<string>) => {
      state.targetCurrency = action.payload
    },
    setAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload
    },
    setResult: (state, action: PayloadAction<number>) => {
      state.result = action.payload
    },
    clearResult: (state) => {
      state.result = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        const { baseCurrency, rates, timestamp } = action.payload
        state.loading = false
        state.rates[baseCurrency] = rates
        state.lastFetched[baseCurrency] = timestamp
        // Set currencyList only if it's empty (first fetch)
        if (state.currencyList.length === 0) {
          const allCodes = Object.keys(rates)
          if (!allCodes.includes(baseCurrency)) {
            allCodes.push(baseCurrency)
          }
          state.currencyList = Array.from(new Set(allCodes)).sort()
        }
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Failed to fetch exchange rates'
      })
  }
})

export const {
  setBaseCurrency,
  setTargetCurrency,
  setAmount,
  setResult,
  clearResult,
  setError,
  clearError,
} = currencySlice.actions

export default currencySlice.reducer