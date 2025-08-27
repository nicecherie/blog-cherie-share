'use client'
import React, { useEffect, useState } from 'react'
import { getSuabaseClient } from '../supabase/client'
import { useToast } from '@/components/toast/toast-provider'
// import { useRouter } from 'next/navigation'

interface ArticleData {
  title: string
  date: string
  author: string
  visibility: 'public' | 'private'
  readTime: number | ''
  tags: string[]
  content: string
  github_url: string
}

interface useArticleDataProps {
  editSlug: string | null
  content: string
  setContent: (content: string) => void
  setIsSaving: (saving: boolean) => void
  initialPost?: {
    id: number
    slug: string
    title: string
    content: string
    date: string
    author: string
    readTime: number | null
    tags: string[]
    lastModified?: string | null
    github_url: string
  }
}

export const useArticleData = ({
  editSlug,
  content,
  setContent,
  setIsSaving,
  initialPost
}: useArticleDataProps) => {
  const [articleData, setArticleData] = useState<ArticleData>({
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
  const [newlyCreatedTag, setNewlyCreatedTag] = useState<string[]>([])

  const { showToast } = useToast()
  const updateArticleData = (
    field: keyof ArticleData,
    value: string | number | string[]
  ) => {
    setArticleData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }
  const handleNewTagCreated = async (newTag: string) => {
    if (!newlyCreatedTag.includes(newTag)) {
      setNewlyCreatedTag([...newlyCreatedTag, newTag])
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    // const supabase = getSuabaseClient()
    // const {
    //   data: { session }
    // } = await supabase.auth.getSession()

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

      if (newlyCreatedTag.length > 0) {
        // newlyCreatedTag: ['react', 'next']
        console.log('newlyCreatedTag', newlyCreatedTag)
        // 把 newlyCreatedTag 数组中每一项添加到 tagsToInsert 中，并设置属性名为 title
        // 判断 数据中是否已经存在，如不存在，则添加 created_at 字段，否则，添加 updated_at 字段

        const slug = editSlug || generateSlug(articleData.title)
        const { error: insertPostError, data: insertPostData } = await supabase
          .from('posts')
          .upsert(
            {
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
        const selectedCates = [
          { category_id: 123, title: 'tag-1' },
          { category_id: 456, title: 'tag-2' }
        ]

        const insertRelData = selectedCates.map((cate) => ({
          // @ts-ignore
          post_id: insertPostData.id,
          category_id: cate.category_id
        }))

        const { data, error } = await supabase
          .from('cate_post_rel')
          .insert(insertRelData)
        // const tagsToInsert = newlyCreatedTag.map((tag) => ({
        //   title: tag,
        //   create: new Date()
        // }))
        // const { error: insertTagsError } = await supabase
        //   .from('post_categories')
        //   .upsert(tagsToInsert, { onConflict: 'title' })
        // if (insertTagsError) {
        //   showToast(insertTagsError?.message, 'error')
        // }
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
    handleNewTagCreated,
    handleSave
  }
}
