
import React from 'react'
import Select, { components } from 'react-select'
import * as FlagIcons from 'country-flag-icons/react/3x2'
import currencyToCountry from './currencyToCountry'

interface CurrencyDropdownProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  disabled?: boolean
  isDark?: boolean
}


function getFlagIcon(currency: string) {
  const countryCode = currencyToCountry[currency] || currency.slice(0, 2)
  // Some currencies may not have a flag, fallback to emoji or nothing
  const Flag = FlagIcons[countryCode as keyof typeof FlagIcons]
  if (Flag) {
    return <Flag title={currency} style={{ width: 24, height: 16, marginRight: 8, borderRadius: 2, boxShadow: '0 0 2px #aaa' }} />
  }
  // Default fallback
  return <span style={{ marginRight: 8 }}>🏳️</span>
}
const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  isDark = false
}) => {
  // React Select expects options as { value, label, icon }
  const selectOptions = options.map(currency => ({
    value: currency,
    label: currency,
    icon: getFlagIcon(currency)
  }))

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
      <label htmlFor={label} className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">{label}</label>
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
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: isDark ? '#23272f' : '#fff',
            color: isDark ? '#f3f4f6' : '#222',
            borderColor: state.isFocused ? (isDark ? '#fbbf24' : '#3b82f6') : (isDark ? '#334155' : '#ccc'),
            boxShadow: state.isFocused ? `0 0 0 2px ${isDark ? '#fbbf24' : '#3b82f6'}` : 'none',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f3f4f6' : '#222',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? (isDark ? '#334155' : '#e0e7ff') : (isDark ? '#1e293b' : '#fff'),
            color: isDark ? '#f3f4f6' : '#222',
          }),
          singleValue: (base) => ({
            ...base,
            color: isDark ? '#f3f4f6' : '#222',
          }),
          placeholder: (base) => ({
            ...base,
            color: isDark ? '#cbd5e1' : '#888',
          }),
          input: (base) => ({
            ...base,
            color: isDark ? '#f3f4f6' : '#222',
          }),
        }}
      />
    </div>
  )
}

export default CurrencyDropdown