'use client'

import Link from 'next/link'
import { DiGithubBadge } from 'react-icons/di'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'
import { mapAuthError } from '@/lib/hooks/auth-errors'
import { useAuthForm } from '@/lib/hooks/use-auth-form'

export default function Login() {
  const { signIn, signInWithGithub } = useAuth()
  const { email, password, isLoading, setIsLoading, bindEmail, bindPassword } =
    useAuthForm()

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await signInWithGithub()
      if (error) setErrorMsg(mapAuthError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)

    setIsLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) {
        setErrorMsg(mapAuthError(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>使用账户登录以管理您的博客</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center"
            onClick={handleGitHubLogin}
            disabled={isLoading}
          >
            <DiGithubBadge className="h-6 w-6 -mt-0.5 mr-2" />
            使用 GitHub 登录
          </Button>

          <div className="relative mt-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="text-xs relative text-center">
              <span className="bg-card px-2 text-muted-foreground">
                或使用邮箱登录
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">电子邮件</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="username"
                required
                disabled={isLoading}
                {...bindEmail}
              />
            </div>
            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="输入密码"
                autoComplete="current-password"
                required
                disabled={isLoading}
                {...bindPassword}
              />
            </div>

            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '正在登录...' : '登录'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            还没有账户？
            <Link href="/auth/register" className="underline ml-1">
              去注册
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
