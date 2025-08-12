import { cn } from '@/lib/utils'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useRef } from 'react'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps extends SelectPrimitive.SelectTriggerProps {
  className?: string
  children?: React.ReactNode
}

const SelectTrigger = ({
  className,
  children,
  ...props
}: SelectTriggerProps) => {
  const selectRef = useRef<HTMLButtonElement>(null)
  return (
    <SelectPrimitive.Trigger
      ref={selectRef}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

// const SelectContent = () => {}

export { Select, SelectGroup, SelectValue, SelectTrigger }
