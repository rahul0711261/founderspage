"use client"

import { useProgressContext } from "../contexts/ProgressContext"

export default function BackButton({ className = "", onClick }) {
  const progressContext = useProgressContext()

  // If a custom onClick is provided, use that
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition duration-200 ${className}`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>
    )
  }

  // Check if we can go back based on completed steps
  const canGoBack = progressContext.completedSteps && progressContext.completedSteps.length > 0

  const handleBack = () => {
    if (canGoBack) {
      // Go back to dashboard as a safe fallback
      if (progressContext.goToStep) {
        progressContext.goToStep("dashboard")
      }
    }
  }

  if (!canGoBack) {
    return null
  }

  return (
    <button
      onClick={handleBack}
      className={`flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition duration-200 ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>Back</span>
    </button>
  )
}
