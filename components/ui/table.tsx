'use client'
import { useRouter } from 'next/navigation'
import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'

export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-300 shadow-sm dark:border-gray-700">
      <table
        className={`w-full border-collapse text-sm ${className ?? ''}`}
        {...props}
      />
    </div>
  )
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-primary/90 text-lg ${className ?? ''}`} {...props} />
  )
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={`divide-y divide-gray-200 dark:divide-gray-700 ${
        className ?? ''
      }`}
      {...props}
    />
  )
}
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  href?: string
}
export function TableRow({
  className,
  href,
  onClick,
  ...props
}: TableRowProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (href) {
      router.push(href)
    }
    onClick?.(e)
  }

  return (
    <tr
      className={`
        cursor-pointer
        transition-colors
        ${className ?? ''}
      `}
      onClick={handleClick}
      {...props}
    />
  )
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${
        className ?? ''
      }`}
      {...props}
    />
  )
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`px-4 py-3 text-sm text-black dark:text-white ${
        className ?? ''
      }`}
      {...props}
    />
  )
}

export function TableCaption({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={`mt-4 text-sm text-gray-500 dark:text-gray-400 ${
        className ?? ''
      }`}
      {...props}
    />
  )
}
