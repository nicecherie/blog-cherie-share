'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGithub: () => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()
  // 只在dom渲染时执行
  useEffect(() => {
    // 检查用户状态
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      // const { data: userData } = await supabase.auth.getUser()
      // if (!userData.user) {
      //   console.error('User not logged in')
      //   const postData = { ...articleData, content }
      //   localStorage.setItem('unsavePost', JSON.stringify(postData))
      //   // TODO: 跳转至文章编辑页，后续可以去缓存中拿文章数据
      //   const redirectUrl = `/write${editSlug ? `?edit=${editSlug}` : ''}`
      //   // router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`)
      //   setIsSaving(false)
      //   return
      // }
      setLoading(false)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    // console.log('subscription', subscription)
    return () => subscription.unsubscribe()
  }, [])
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    return { error }
  }
  const signOut = async () => {
    await supabase.auth.signOut()
  }
  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/`,
        scopes: 'read:user user:email' // 明确请求用户邮箱权限
      }
    })
    return { error }
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, signInWithGithub }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  // console.log('context', context)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
