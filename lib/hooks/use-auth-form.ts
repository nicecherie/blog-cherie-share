'use client'

import { useState } from 'react'
import { useLoading } from '@/components/loading'

export function useAuthForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const { isLoading, setIsLoading } = useLoading()

  // 通用绑定函数
  const bindField = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  })

  // 简单的校验逻辑（可选）
  const validate = () => {
    if (!form.email) return '请输入邮箱'
    if (!form.password) return '请输入密码'
    if (form.password.length < 6) return '密码至少 6 位'
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      return '两次输入的密码不一致'
    }
    return null
  }

  return {
    ...form,
    isLoading,
    setIsLoading,
    bindEmail: bindField('email'),
    bindPassword: bindField('password'),
    bindConfirmPassword: bindField('confirmPassword'),
    validate
  }
}
