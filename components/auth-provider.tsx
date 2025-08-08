'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSuabaseClient } from '@/lib/supabase/client'

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
  const supabase = getSuabaseClient()
  // 只在dom渲染时执行
  useEffect(() => {
    // 检查用户状态
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      // 写入用户信息
      supabase
        .from('users')
        .upsert({
          id: session?.user.id,
          email: session?.user.email,
          username: session?.user.user_metadata.username,
          display_name: session?.user.user_metadata.display_name,
          avatar_url: session?.user.user_metadata.avatar_url,
          bio: session?.user.user_metadata.bio
        })
        .then((resp) => {
          console.log(resp)
        })
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
