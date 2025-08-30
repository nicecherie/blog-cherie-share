// hooks/useLoading.ts
'use client'
import { useLoading } from '@/components/loading'

/**
 * 包装一个异步函数，在调用时自动触发全局 Loading 状态
 */
export function useWithLoading() {
  const { setIsLoading } = useLoading()

  function withLoading<T extends (...args: any[]) => Promise<any>>(fn: T) {
    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      setIsLoading(true)
      try {
        return await fn(...args)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return { withLoading }
}
