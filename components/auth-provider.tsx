'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type {
  User,
  AuthError,
  Session,
  PostgrestError
} from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useToast } from './toast/toast-provider'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    data: { user: User | null; session: Session | null }
    error: AuthError | null
  }>
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    data: { user: User | null; session: Session | null }
    error: AuthError | null
  }>
  signOut: () => Promise<void>
  signInWithGithub: () => Promise<{ error: AuthError | null }>
  // 新增 updateProfile 函数声明
  updateProfile: (
    username: string,
    avatar_url?: string
  ) => Promise<{
    data: { user: User | null; session: Session | null }
    error: AuthError | null
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()
  const { showToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('获取 session 失败:', error)
        }
        setUser(data?.session?.user ?? null)
      } finally {
        setLoading(false)
      }
    }
    initAuth()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      showToast(error.message, 'error')
    }
    if (!data?.session) {
      showToast('请登录邮箱确认', 'success')
      router.push('/auth/login')
    } else {
      showToast('登录成功', 'success')
      router.push('/')
    }
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      if (error.message.includes('already registered')) {
        showToast('该邮箱已注册，请直接登录', 'error')
      } else {
        showToast(error.message, 'error')
      }
      return { data: { user: null, session: null }, error }
    }

    // 注册成功，但 Supabase 需要邮箱验证
    showToast('注册成功，请前往邮箱确认', 'success')
    router.push('/auth/login')

    return {
      data: {
        user: data.user,
        session: data.session
      },
      error: null
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/`,
        scopes: 'read:user user:email'
      }
    })
    return { error }
  }
  const updateProfile = async (username: string, avatar_url?: string) => {
    if (!user) {
      return {
        data: { user: null, session: null },
        error: { message: '用户未登录', status: 401 } as AuthError
      }
    }

    const updates = {
      id: user.id,
      username,
      avatar_url,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase.from('users').upsert(updates)

    if (error) {
      showToast(error.message, 'error')
      // 将 PostgrestError 转换为 AuthError 类型结构以匹配接口
      return {
        data: { user: null, session: null },
        error: {
          message: error.message,
          status: (error as any).status || 500,
          name: 'PostgrestError'
        } as AuthError
      }
    }

    // 刷新用户信息
    const { data: userData, error: userError } = await supabase.auth.updateUser(
      {
        data: { username, avatar_url }
      }
    )

    if (userError) {
      showToast(userError.message, 'error')
      return {
        data: { user: null, session: null },
        error: userError
      }
    }

    setUser(userData.user)
    showToast('资料更新成功', 'success')

    return {
      data: {
        user: userData.user,
        session: null // session 不变
      },
      error: null
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGithub,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
