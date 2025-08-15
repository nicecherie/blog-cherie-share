'use client'
import { FC, useEffect, useState } from 'react'
type ToastType = 'success' | 'error' | 'info'
interface ToastProps {
  id?: string
  type: ToastType
  message: string
  duration?: number
  onClose: () => void
}
const icons = {
  success: (
    <svg
      className="w-6 h-6 text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-6 h-6 text-red-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 9l-6 6m0-6l6 6"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-6 h-6 text-blue-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  )
}

const Toast: FC<ToastProps> = ({ message, type, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        onClose()
      }, 500)
    }, 3000)
  }, [onClose])
  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 500)
  }

  const animationClasses = isExiting ? 'animate-toast-out' : 'animate-toast-in'

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-border bg-card text-foreground min-w-[250px] max-w-sm ${animationClasses}`}
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
    >
      {icons[type]}
      <span className="text-base font-medium flex-1">{message}</span>
      <button
        onClick={handleDismiss}
        className="text-muted-foreground hover:text-foreground"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}

export default Toast
