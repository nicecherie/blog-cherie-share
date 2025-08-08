'use client'
import { cn } from '@/lib/utils'
import { useRef, useImperativeHandle } from 'react'
// 定义 ref 的类型
interface InputRef {
  focus: () => void
}
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  type: string
  ref?: React.Ref<InputRef>
}
export function Input({ className, type, ref, ...props }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
    }
  }))
  return (
    <input
      ref={inputRef}
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed',
        className
      )}
      {...props}
    ></input>
  )
}
