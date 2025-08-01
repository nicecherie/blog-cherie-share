"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Lable"
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"

import { DiGithubBadge } from 'react-icons/di';
export default function Login() {
  const [isGitHubLogin, setIsGitHubLogin] = useState(false)
  const { signIn, signInWithGithub } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const handleGitHubLogin = async () => {
    setIsGitHubLogin(true)
    try {
      const {error} = await signInWithGithub()
      console.log('data', error)
    } catch (error) {
      console.error(error)
    } finally { 
      setIsGitHubLogin(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() 
  }
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>登录您的账户以管理您的博客</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full flex items-center" onClick={handleGitHubLogin}>
            <DiGithubBadge className="h-6 w-6 -mt-0.5 mr-2"/>
            使用 GitHub 登录 (需要获取邮箱权限)</Button>

          <div className="relative mt-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="text-xs relative text-center">
              <span className="bg-background px-2 text-muted-foreground">或使用邮箱登录</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-box space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">电子邮件</Label>
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  required
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密码</Label>
                  <Link href="/forgot-password" className="text-sm underline">忘记密码?</Link>
                </div>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="email"
                  required
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button
                className="w-full"
                type="submit"
                disabled={isLoading}
              >Login</Button>
            </div>
          </form>

        </CardContent>

        <CardFooter className="flex flex-col gap-2"> 
          <Link href="/register" className="hover:underline">sign up</Link>
        </CardFooter>
      </Card>
    </div>
  )
}