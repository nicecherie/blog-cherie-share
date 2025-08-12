import { cn } from '@/lib/utils'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { useRef } from 'react'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

interface PopoverContentProps extends PopoverPrimitive.PopoverContentProps {
  sideOffset?: number
  alignOffset?: number
  align?: 'start' | 'center' | 'end'
  className?: string
}

const PopoverContent = ({
  className,
  sideOffset = 4,
  alignOffset = 0,
  align = 'center',
  ...props
}: PopoverContentProps) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        align={align}
        className={cn('', className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
