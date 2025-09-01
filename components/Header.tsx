'use client'

import Link from 'next/link'
import { useAuth } from './auth-provider'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { LuSun, LuMoon } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isAuthLog = pathname.startsWith('/auth')

  return (
    <header
      className="sticky top-0 z-50
        flex justify-between items-center py-4 px-8
        backdrop-blur-md bg-gradient-to-r from-white/60 to-white/30 
        dark:from-gray-900/60 dark:to-gray-900/30"
    >
      {/* 左侧 Logo */}
      <Link href="/" className="text-2xl font-bold">
        {user?.user_metadata?.name ? user.user_metadata.name + "'s" : 'my'} blog
      </Link>

      {/* 中间导航 */}
      <nav>
        <ul className="flex space-x-4">
          {[
            { href: '/', label: '首页' },
            { href: '/categories', label: '分类' },
            { href: '/publish', label: '新文章' }
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-muted hover:text-muted-foreground font-medium ${
                  pathname === href ? 'text-primary hover:text-primary/85' : ''
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 右侧用户区域 */}
      <div className="right-content flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url || ''}
                    alt={user.email || ''}
                  />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user.email || '用户'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/blog">文章管理</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/publish">创建文章</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">个人资料</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={async () => {
                  await signOut()
                  router.push('/auth/login')
                }}
              >
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={isAuthLog ? 'hidden' : ''}
          >
            <Link href="/auth/login">登录</Link>
          </Button>
        )}

        {/* 主题切换 */}
        <Button
          variant="outline"
          className="h-10 w-10 rounded-full p-0"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <LuSun className="hidden dark:block h-5 w-5" />
          <LuMoon className="block dark:hidden h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
