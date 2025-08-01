"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { useState } from "react"

export function Header() {
  console.log('useAuth()', useAuth())
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  console.log('user', user)

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white">
      <Link href="/" className="text-2xl font-bold">My Blog</Link>
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/categories">Categories</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
      </nav>
      <div className="right-content">
        {user ? (
          <>
            {/* <Link href="/dashboard">Dashboard</Link> */}
            
            <Link href="/login" onClick={() => signOut()}>sign out</Link>
          </>
        ) : (
          <Link href="/login" onClick={() => {setIsOpen(true)}}>Login</Link>
        )}
      </div>
    </header>
  )
}