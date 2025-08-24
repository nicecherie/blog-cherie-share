'use client'

import Link from 'next/link'
import { useAuth } from './auth-provider'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

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

  const pathname = usePathname()

  return (
    <header className={`my-header flex justify-between items-center py-4 px-8`}>
      <Link href="/" className="text-2xl font-bold">
        {user?.user_metadata?.name ? user?.user_metadata?.name + "'s" : 'my'}{' '}
        blog
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link
              className={`text-muted hover:text-muted-foreground font-medium ${
                pathname === '/' ? 'text-primary hover:text-primary/85' : ''
              }`}
              href="/"
            >
              首页
            </Link>
          </li>
          <li>
            <Link
              className={`text-muted hover:text-muted-foreground font-medium ${
                pathname === '/categories'
                  ? 'text-primary hover:text-primary/85'
                  : ''
              }`}
              href="/categories"
            >
              分类
            </Link>
          </li>
          <li>
            <Link
              className={`text-muted hover:text-muted-foreground font-medium ${
                pathname === '/publish'
                  ? 'text-primary hover:text-primary/85'
                  : ''
              }`}
              href="/publish"
            >
              新文章
            </Link>
          </li>
        </ul>
      </nav>
      <div className="right-content flex items-center gap-4">
        {user ? (
          <>
            {/* <Link href="/dashboard">Dashboard</Link> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 rounded-full">
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
          variant="default"
          className="ml-2"
          size="sm"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <LuSun className="hidden dark:block" />
          <LuMoon className="block dark:hidden" />
        </Button>
      </div>
    </header>
  )
}
