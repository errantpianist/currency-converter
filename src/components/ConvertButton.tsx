import React from 'react'

interface ConvertButtonProps {
  onClick: () => void
  disabled: boolean
}

const ConvertButton: React.FC<ConvertButtonProps> = ({ 
  onClick, 
  disabled 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Convert currency"
      className="w-full py-3 rounded-md font-semibold text-lg transition-colors disabled:cursor-not-allowed bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)]"
      style={{
        background: disabled ? 'var(--button-disabled-bg, #d1d5db)' : 'var(--button-bg)',
        color: 'var(--button-text)',
      }}
    >
      Convert
    </button>
  )
}

export default ConvertButton