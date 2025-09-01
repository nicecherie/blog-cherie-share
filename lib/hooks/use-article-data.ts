'use client'
import React, { useState, useEffect } from 'react'
import { getSupabaseClient } from '../supabase/client'
import { useToast } from '@/components/toast/toast-provider'
import { Category, Post } from '@/types'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'

// 工具函数：生成 slug
const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') +
  '-' +
  Date.now().toString().slice(-6)

interface ArticleData {
  id: string
  title: string
  date: string
  author: string
  visibility: 'public' | 'private'
  readTime: number | null
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
  initialPost?: Partial<ArticleData> & {
    slug: string
    lastModified?: string | null
  }
}

export const useArticleData = ({
  id,
  editSlug,
  content,
  setContent,
  setIsSaving,
  initialPost
}: useArticleDataProps) => {
  const [articleData, setArticleData] = useState<ArticleData>({
    id: initialPost?.id?.toString() || '',
    title: initialPost?.title || '',
    date: initialPost?.date || '',
    author: initialPost?.author || '',
    visibility: (initialPost?.visibility as 'public' | 'private') || 'public',
    readTime: initialPost?.readTime || null,
    tags: initialPost?.tags || [],
    content: initialPost?.content || '',
    github_url: initialPost?.github_url || ''
  })

  const router = useRouter()
  const supabase = getSupabaseClient()
  const { showToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  /** ✅ 类型安全的更新方法 */
  function updateArticleData<K extends keyof ArticleData>(
    field: K,
    value: ArticleData[K]
  ) {
    setArticleData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  /** 保存文章 */
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!content) {
        setIsSaving(false)
        return showToast('请填写文章内容', 'error')
      }

      const slug = editSlug || generateSlug(articleData.title)
      const newId =
        articleData.id && articleData.id.trim() !== '' ? articleData.id : uuid()

      // 保存文章
      const { error: insertPostError } = await supabase.from('posts').upsert(
        {
          id: newId,
          slug,
          title: articleData.title,
          author_name: session?.user.user_metadata.full_name,
          author_id: session?.user.id,
          tags: articleData.tags,
          content,
          visibility: articleData.visibility
        },
        { onConflict: 'slug' }
      )
      if (insertPostError) throw insertPostError

      // 清理旧的关系
      await supabase.from('cate_post_rel').delete().eq('post_id', newId)

      // 插入新的关系
      if (articleData.tags.length > 0) {
        const insertRelData = articleData.tags.map((cate) => ({
          post_id: newId,
          cate_id: cate.category_id
        }))
        const { error: relError } = await supabase
          .from('cate_post_rel')
          .insert(insertRelData)
        if (relError) throw relError
      }

      localStorage.removeItem('unsavedPost')
      showToast('提交成功！', 'success')
      router.push('/')
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message?: string }).message
          : '保存失败，请检查网络或联系管理员。'
      console.error('Error saving post:', message)
      showToast(message ?? '保存失败，请检查网络或联系管理员。', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * 统一把 tags 转换成 Category[]
   * - null / undefined => []
   * - string => [{ category_id: string, name: string }]
   * - string[] => Category[]
   * - Category[] => 原样返回
   * - 其他类型 => []
   */
  function normalizeTags(tags: unknown): Category[] {
    if (!tags) return []

    if (Array.isArray(tags)) {
      return tags.map((t) => {
        const obj = t as Record<string, any>
        return {
          category_id: obj.category_id ?? obj.id ?? '',
          title: obj.name ?? obj.title ?? ''
        }
      })
    }

    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags)
        return normalizeTags(parsed)
      } catch {
        return []
      }
    }

    return []
  }

  /** 转换 Supabase 返回的数据 -> ArticleData */
  const mapPostToArticleData = (post: Post): ArticleData => {
    return {
      id: post.id,
      title: post.title,
      date: post.created_at,
      author: post.author_name,
      visibility: post.visibility as 'public' | 'private',
      readTime: post.read_time || null,
      tags: normalizeTags(post.tags), // ✅ 永远是 Category[]
      content: post.content,
      github_url: post.github_url || ''
    }
  }
  const [isLoading, setIsLoading] = useState(false) // ⬅️ 是否正在加载
  const [isLoaded, setIsLoaded] = useState(false) // ⬅️ 是否已加载过（成功或失败）
  /** 获取文章 */
  const getArticleData = async (postId: string) => {
    setIsLoading(true)
    setIsLoaded(false)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()
    setIsLoading(false)
    setIsLoaded(true)
    if (error) {
      console.error('Error fetching article data:', error)
      return null
    }
    // @ts-ignore
    const mappedData = mapPostToArticleData(data as Post)
    console.log(mappedData, 'mappedData')

    setArticleData(mappedData)
    setContent(mappedData.content)

    return mappedData
  }
  /** ✅ 自动加载文章 */
  useEffect(() => {
    if (id) {
      getArticleData(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return {
    articleData,
    setArticleData,
    isEditing,
    setIsEditing,
    updateArticleData,
    handleSave,
    getArticleData,
    isLoading,
    isLoaded
  }
}
