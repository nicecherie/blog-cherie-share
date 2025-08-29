'use client'
// 创建一个 loading provider
import { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'

interface LoadingProvider {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const LoadingContext = createContext<LoadingProvider | undefined>(
  undefined
)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {/* 加一个loading遮罩层 */}
      {isLoading && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center 
                    bg-white/50 dark:bg-black/50 backdrop-blur-md"
        >
          <motion.div
            className="w-12 h-12 border-4 border-primary border-t-transparent 
                   rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  )
}
export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
