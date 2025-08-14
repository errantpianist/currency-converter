import React from 'react'
import Select from 'react-select'

interface CurrencyDropdownProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  disabled?: boolean
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false
}) => {
  // React Select expects options as { value, label }
  const selectOptions = options.map(currency => ({ value: currency, label: currency }))

  // Find the selected option object
  const selectedOption = selectOptions.find(opt => opt.value === value) || null

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
      />
    </div>
  )
}

export default CurrencyDropdown