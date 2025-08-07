'use client'

import Link from 'next/link'
import { useAuth } from './auth-provider'
import { useState } from 'react'

import { useTheme } from 'next-themes'
import { LuSun, LuMoon } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  console.log('user', user)

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white">
      <Link href="/" className="text-2xl font-bold">
        My Blog
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/categories">Categories</Link>
          </li>
          <li>
            <Link href="/publish">Publish</Link>
          </li>
        </ul>
      </nav>
      <div className="right-content">
        {user ? (
          <>
            {/* <Link href="/dashboard">Dashboard</Link> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url || ''}
                      alt={user.email || ''}
                    />
                  </Avatar>
                  <DropdownMenu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.email || '用户'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard">控制面板</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/blog/create">创建文章</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile">个人资料</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem color="red">
                  <Link href="/login" onClick={() => signOut()}>
                    退出登录
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link
            href="/login"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            Login
          </Link>
        )}
        <Button
          variant="ghost"
          onClick={() =>
            theme === 'light' ? setTheme('dark') : setTheme('light')
          }
        >
          <LuSun className="hidden dark:block" />
          <LuMoon className="block dark:hidden" />
        </Button>
      </div>
    </header>
  )
}
