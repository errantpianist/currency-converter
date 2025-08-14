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
      className={
        `w-full py-3 rounded-md font-semibold text-lg transition-colors disabled:cursor-not-allowed ` +
        `bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 dark:bg-blue-800 dark:text-gray-100 dark:hover:bg-blue-900 dark:disabled:bg-gray-700`
      }
    >
      Convert
    </button>
  )
}

export default ConvertButton