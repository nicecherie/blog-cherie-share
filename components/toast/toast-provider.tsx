'use client'
import { createContext, useCallback, useContext, useState } from 'react'
import { nanoid } from 'nanoid'
import Toast from './toast'
type ToastType = 'success' | 'error' | 'info'
export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}
interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])
  const showToast = useCallback((message: string, type?: ToastType) => {
    // console.log(message, type)
    const toast = {
      id: nanoid(),
      message,
      type: type || 'success',
      duration: 5000
    }
    setToasts((prevToasts) => [...prevToasts, toast])
  }, [])
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
