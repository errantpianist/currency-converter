
import React from 'react'
import Select, { components } from 'react-select'
// Dynamically import all flag components
import * as FlagIcons from 'country-flag-icons/react/3x2'

interface CurrencyDropdownProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  disabled?: boolean
}

// Helper: map currency code to country code for flag
const currencyToCountry: Record<string, string> = {
  // Common mappings
  USD: 'US',
  EUR: 'EU',
  GBP: 'GB',
  JPY: 'JP',
  AUD: 'AU',
  CAD: 'CA',
  CHF: 'CH',
  CNY: 'CN',
  HKD: 'HK',
  NZD: 'NZ',
  SEK: 'SE',
  KRW: 'KR',
  SGD: 'SG',
  NOK: 'NO',
  MXN: 'MX',
  INR: 'IN',
  RUB: 'RU',
  ZAR: 'ZA',
  TRY: 'TR',
  BRL: 'BR',
  TWD: 'TW',
  DKK: 'DK',
  PLN: 'PL',
  THB: 'TH',
  IDR: 'ID',
  HUF: 'HU',
  CZK: 'CZ',
  ILS: 'IL',
  CLP: 'CL',
  PHP: 'PH',
  AED: 'AE',
  COP: 'CO',
  SAR: 'SA',
  MYR: 'MY',
  RON: 'RO',
  // Supranational, precious metals, crypto, regional currencies, fallback
  XAU: '', // Gold
  XAG: '', // Silver
  XPT: '', // Platinum
  XPD: '', // Palladium
  BTC: '', // Bitcoin
  ETH: '', // Ethereum
  // Regional currency representative flags
  XAF: 'CM', // Cameroon for Central African CFA franc
  XOF: 'SN', // Senegal for West African CFA franc
  XCD: 'LC', // Saint Lucia for East Caribbean dollar
  XPF: 'PF', // French Polynesia for CFP franc
  XCG: 'CW', // Curaçao for Caribbean guilder
  // Add more as needed
}

function getFlagIcon(currency: string) {
  const countryCode = currencyToCountry[currency] || currency.slice(0, 2)
  // Some currencies may not have a flag, fallback to emoji or nothing
  const Flag = FlagIcons[countryCode as keyof typeof FlagIcons]
  if (Flag) {
    return <Flag title={currency} style={{ width: 24, height: 16, marginRight: 8, borderRadius: 2, boxShadow: '0 0 2px #aaa' }} />
  }
  // Fallbacks for special cases
  if (currency === 'XAU') return <span style={{ marginRight: 8 }}>🥇</span>
  if (currency === 'XAG') return <span style={{ marginRight: 8 }}>🥈</span>
  if (currency === 'XPT') return <span style={{ marginRight: 8 }}>⚪️</span>
  if (currency === 'XPD') return <span style={{ marginRight: 8 }}>⚫️</span>
  if (currency === 'BTC') return <span style={{ marginRight: 8 }}>₿</span>
  if (currency === 'ETH') return <span style={{ marginRight: 8 }}>Ξ</span>
  // Default fallback
  return <span style={{ marginRight: 8 }}>🏳️</span>
}
const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false
}) => {
  // React Select expects options as { value, label, icon }
  const selectOptions = options.map(currency => ({
    value: currency,
    label: currency,
    icon: getFlagIcon(currency)
  }))

  // Find the selected option object
  const selectedOption = selectOptions.find(opt => opt.value === value) || null

  // Custom option renderer for react-select
  const Option = (props: any) => (
    <components.Option {...props}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {props.data.icon}
        <span style={{ lineHeight: 1, fontSize: '1rem' }}>{props.data.label}</span>
      </span>
    </components.Option>
  )

  // Custom single value renderer
  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {props.data.icon}
        <span style={{ lineHeight: 1, fontSize: '1rem' }}>{props.data.label}</span>
      </span>
    </components.SingleValue>
  )
  return (
    <div className="mb-6">
      <label htmlFor={label} className="block mb-2 font-semibold text-gray-700">{label}</label>
      <Select
        inputId={label}
        value={selectedOption}
        onChange={opt => onChange(opt ? opt.value : '')}
        options={selectOptions}
        isDisabled={disabled}
        isSearchable={true}
        classNamePrefix="currency-select"
        placeholder={`Select ${label}`}
        aria-label={label}
        components={{ Option, SingleValue }}
      />
    </div>
  )
}

export default CurrencyDropdown