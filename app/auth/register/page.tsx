'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DiGithubBadge } from 'react-icons/di'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'
import { useLoading } from '@/components/loading'
import { mapAuthError } from '@/lib/hooks/auth-errors'

export default function Register() {
  const { signUp, signInWithGithub } = useAuth()
  const { isLoading, setIsLoading } = useLoading()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleGitHubRegister = async () => {
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

    if (password !== confirmPassword) {
      setErrorMsg('两次输入的密码不一致')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await signUp(email, password)
      if (error) {
        if (error.message.includes('already registered')) {
          setErrorMsg('该邮箱已被注册，请直接登录')
        } else {
          setErrorMsg(mapAuthError(error))
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">注册</CardTitle>
          <CardDescription>创建一个新账户以管理您的博客</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center"
            onClick={handleGitHubRegister}
            disabled={isLoading}
          >
            <DiGithubBadge className="h-6 w-6 -mt-0.5 mr-2" />
            使用 GitHub 注册
          </Button>

          <div className="relative mt-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="text-xs relative text-center">
              <span className="bg-card px-2 text-muted-foreground">
                或使用邮箱注册
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
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="输入密码"
                autoComplete="new-password"
                required
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                autoComplete="new-password"
                required
                value={confirmPassword}
                disabled={isLoading}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '正在注册...' : '注册'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            已有账户？
            <Link href="/auth/login" className="underline ml-1">
              去登录
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
