const BASE_URL = 'https://www.floatrates.com/daily'

export interface RateData {
  code: string
  rate: number
}

export const fetchExchangeRates = async (baseCurrency: string): Promise<Record<string, RateData>> => {
  try {
    const response = await fetch(`${BASE_URL}/${baseCurrency.toLowerCase()}.json`)
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates')
    }
    const data = await response.json()
    
    // Transform data to our format
    const rates: Record<string, RateData> = {}
    Object.keys(data).forEach(key => {
      rates[key.toUpperCase()] = {
        code: key.toUpperCase(),
        rate: data[key].rate
      }
    })
    
    return rates
  } catch (error) {
    throw new Error('Network error or invalid response')
  }
}