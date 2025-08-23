'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

interface RadioGroupProps extends RadioGroupPrimitive.RadioGroupProps {
  className?: string
  ref?: React.RefObject<HTMLDivElement>
}

interface RadioGroupItemProps extends RadioGroupPrimitive.RadioGroupItemProps {
  className?: string
  ref?: React.RefObject<HTMLButtonElement>
}

const RadioGroup = ({ className, ref, ...props }: RadioGroupProps) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  )
}

const RadioGroupItem = ({ className, ...props }: RadioGroupItemProps) => {
  return (
    <RadioGroupPrimitive.Item className={cn('', className)} {...props}>
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current text-selected" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
