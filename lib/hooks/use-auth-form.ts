'use client'

import { useState } from 'react'
import { useLoading } from '@/components/loading'

export function useAuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { isLoading, setIsLoading } = useLoading()

  const bindEmail = {
    value: email,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setEmail(e.target.value)
  }

  const bindPassword = {
    value: password,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setPassword(e.target.value)
  }

  const bindConfirmPassword = {
    value: confirmPassword,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setConfirmPassword(e.target.value)
  }

  return {
    email,
    password,
    confirmPassword,
    isLoading,
    setIsLoading,
    bindEmail,
    bindPassword,
    bindConfirmPassword
  }
}
