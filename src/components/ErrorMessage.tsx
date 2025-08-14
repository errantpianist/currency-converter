import React from 'react'

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null
  
  return (
    <div className="mb-4 p-4 bg-red-100 rounded-md border-l-4 border-red-500" aria-live="polite">
      <p className="text-red-700 font-medium">{message}</p>
    </div>
  )
}

export default ErrorMessage