// lib/auth-errors.ts

import type { AuthError } from '@supabase/supabase-js'

/**
 * 将 Supabase Auth 错误转为更友好的提示
 */
export function mapAuthError(error: AuthError | null): string | null {
  if (!error) return null

  switch (error.message) {
    case 'Invalid login credentials':
      return '邮箱或密码错误'
    case 'Email not confirmed':
      return '请先到邮箱中点击确认邮件后再登录'
    case 'User already registered':
      return '该邮箱已注册，请直接登录'
    case 'Password should be at least 6 characters':
      return '密码长度至少 6 位'
    case 'Invalid email':
      return '邮箱格式不正确'
    default:
      return '发生未知错误，请稍后再试'
  }
}
