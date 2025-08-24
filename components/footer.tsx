'use client'
import { usePathname } from 'next/navigation'
export default function Footer() {
  const pathname = usePathname()
  if (pathname !== '/') return null
  return (
    <footer className="py-2">
      <div className="container mx-auto text-center text-sm px-4 text-muted-foreground">
        © {new Date().getFullYear()} cherie. 保留所有权利.
      </div>
    </footer>
  )
}
