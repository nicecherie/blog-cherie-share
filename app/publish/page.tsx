'use client'
import { useAuth } from '@/components/auth-provider'

import { getSuabaseClient } from '@/lib/supabase/client'
import { Post } from '@/types'
import { Suspense } from 'react'
import RichTextEditor from './components/rich-text-editor'
export default function Publish({ post }: { post: Post }) {
  const { user } = useAuth()
  const supabase = getSuabaseClient()

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   // TODO: 未登录跳转登录页面
  //   if (!user) {
  //     return
  //   }
  //   // TODO: 表单校验

  //   // 保存提交
  //   try {
  //     // 生成唯一标识
  //     const slug =
  //       title
  //         .toLowerCase()
  //         .replace(/\s+/g, '-')
  //         .replace(/[^\w-]+/g, '')
  //         .replace(/--+/g, '-')
  //         .replace(/^-+/, '')
  //         .replace(/-+$/, '') +
  //       '-' +
  //       Date.now().toString().slice(-6)

  //     // 创建文章
  //     const { data, error } = await supabase
  //       .from('posts')
  //       .insert({
  //         title,
  //         slug,
  //         content,
  //         excerpt,
  //         author_id: user?.id,
  //         published: true,
  //         is_public: true
  //       })
  //       .select()

  //     if (error) {
  //       throw error
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RichTextEditor></RichTextEditor>
    </Suspense>
  )
}
