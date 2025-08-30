'use client'
// 创建一个 loading provider
import { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import Loading from '@/app/loading'

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
      {isLoading && <Loading />}
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
