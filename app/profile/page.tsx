'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { useLoading } from '@/components/loading'
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

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { isLoading, setIsLoading } = useLoading()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (user) {
      setEmail(user.email || '')
      setUsername(user.user_metadata?.user_name || '')
      setAvatarUrl(user.user_metadata?.avatar_url || '')
      setBio(user.user_metadata?.bio || '')
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const { error } = await updateProfile(username, avatarUrl)
      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccessMsg('资料已更新')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">请先登录</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">个人资料</CardTitle>
          <CardDescription>更新您的账户信息</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>

            <div>
              <Label htmlFor="username">昵称</Label>
              <Input
                id="username"
                type="text"
                placeholder="输入昵称"
                value={username}
                disabled={isLoading}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="avatarUrl">头像 URL</Label>
              <Input
                id="avatarUrl"
                type="text"
                placeholder="https://example.com/avatar.png"
                value={avatarUrl}
                disabled={isLoading}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bio">简介</Label>
              <Input
                id="bio"
                type="text"
                placeholder="简单介绍一下自己"
                value={bio}
                disabled={isLoading}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            {successMsg && (
              <p className="text-sm text-green-500">{successMsg}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存修改'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground text-center">
          你的 UID: {user.id}
        </CardFooter>
      </Card>
    </div>
  )
}
