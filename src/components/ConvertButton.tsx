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
      className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold text-lg transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      Convert
    </button>
  )
}

export default ConvertButton