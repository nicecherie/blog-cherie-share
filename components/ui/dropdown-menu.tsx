"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

// const DropdownMenuContent = DropdownMenuPrimitive.Content

// const DropdownMenuItem = DropdownMenuPrimitive.Item

const DropdownMenuContent = ({className, sideOffset = 4, ...props}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {inset?: boolean}) => {
  return (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
  )
}
const DropdownMenuItem = ({className, inset, ...props}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {inset?: boolean}) => {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent ", inset && 'pl-8', className
      )}
      {...props}
    />
  )
}
const DropdownMenuSeparator = ({className, ...props}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) => {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn(
        "-mx-1 my-1 h-px bg-muted", className
      )}
      {...props}
    />
  )
}
const DropdownMenuSubTrigger = ({className, inset, children, ...props}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {inset?: boolean}) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "-mx-1",
        inset && "pl-8", className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}
const DropdownMenuLabel = ({className, inset, ...props}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {inset?: boolean}) => {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8", className
      )}
      {...props}
    />
  )
}
const DropdownMenuSubContent = ({className, ...props}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) => {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        "-mx-1", className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel
}
