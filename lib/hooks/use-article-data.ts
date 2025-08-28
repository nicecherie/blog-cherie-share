'use client'
import React, { useEffect, useState } from 'react'
import { getSuabaseClient } from '../supabase/client'
import { useToast } from '@/components/toast/toast-provider'
// import { useRouter } from 'next/navigation'
import { Category } from '@/types'
import { v4 as uuid } from 'uuid'

interface ArticleData {
  id: string
  title: string
  date: string
  author: string
  visibility: 'public' | 'private'
  readTime: number | ''
  tags: Category[]
  content: string
  github_url: string
}

interface useArticleDataProps {
  id: string | null
  editSlug: string | null
  content: string
  setContent: (content: string) => void
  setIsSaving: (saving: boolean) => void
  initialPost?: {
    id: number | string
    slug: string
    title: string
    content: string
    date: string
    author: string
    readTime: number | null
    tags: Category[]
    lastModified?: string | null
    github_url: string
  }
}

export const useArticleData = ({
  id: id,
  editSlug,
  content,
  setContent,
  setIsSaving,
  initialPost
}: useArticleDataProps) => {
  const [articleData, setArticleData] = useState<ArticleData>({
    id: '',
    title: '',
    date: '',
    author: '',
    visibility: 'public',
    readTime: '',
    tags: [],
    content: '',
    github_url: ''
  })
  // const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const { showToast } = useToast()
  const updateArticleData = (
    field: keyof ArticleData,
    value: string | number | string[] | Category[]
  ) => {
    setArticleData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    const supabase = getSuabaseClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()

    // TODO: check if user is logged in
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
    const generateSlug = (title: string) => {
      const slug =
        title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '') +
        '-' +
        Date.now().toString().slice(-6)
      return slug
    }
    try {
      // 上传 tags 到数据库
      const supabase = getSuabaseClient()
      console.log('articleData:::', articleData)

      const slug = editSlug || generateSlug(articleData.title)
      articleData.id = uuid()
      const { error: insertPostError, data: insertPostData } = await supabase
        .from('posts')
        .upsert(
          {
            id: articleData.id,
            slug,
            title: articleData.title,
            // date: articleData.date,
            author_name: session?.user.user_metadata.full_name,
            // read_time: articleData.readTime === '' ? null : articleData.readTime,
            tags: articleData.tags,
            content,
            visibility: articleData.visibility,

            // lastModified: new Date().toISOString(),
            author_id: session?.user.id
            // github_url: articleData.github_url
          },
          { onConflict: 'slug' }
        )
      if (insertPostError) throw insertPostError

      // TODO 保存文章 和 分类之间的关系
      // TODO: 获取数据库中已存在的 tag，判断是否要给新的 created_at 或 updated_at
      // 文章id -> [{categrory_id, title}, {categrory_id-2, title-2}]
      // TODO: 从页面中获取真实数据

      const insertRelData = articleData.tags.map((cate) => ({
        // @ts-ignore
        post_id: articleData.id,
        cate_id: cate.category_id
      }))
      const { data, error } = await supabase
        .from('cate_post_rel')
        .insert(insertRelData)
      if (error) {
        showToast(error.message, 'error')
      }
      localStorage.removeItem('unsavedPost')
      // toast 提示用户保存成功
      showToast('提交成功！', 'success')
    } catch (err: unknown) {
      const errorMessage = '保存失败，请检查网络或联系管理员。'
      if (err && typeof err === 'object' && 'message' in err) {
        console.error(
          'Error saving post:',
          (err as { message?: string }).message || errorMessage
        )
      } else {
        console.error('Error saving post:', errorMessage)
      }
      // TODO: toast 提示用户错误
      showToast(errorMessage, 'error')
    } finally {
      setIsSaving(false)
    }
  }
  return {
    articleData,
    isEditing,
    updateArticleData,
    handleSave
  }
}
