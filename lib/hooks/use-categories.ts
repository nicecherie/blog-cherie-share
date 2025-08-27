'use client'

import { useEffect, useState } from 'react'
import { getSuabaseClient } from '../supabase/client'
import { Category } from '@/types'
import { useToast } from '@/components/toast/toast-provider'
export const useTags = () => {
  const [availableTags, setAvailableTags] = useState<Category[]>([])
  const [tagsLoading, setTagsLoading] = useState(false)
  const supabase = getSuabaseClient()
  const { showToast } = useToast()

  useEffect(() => {
    // 获取所有标签
    const fetchTags = async () => {
      // 判断是否登录
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session) {
        setAvailableTags([])
        return
      }

      setTagsLoading(true)

      try {
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
          console.error('Missing Supabase environment variables')
          setAvailableTags([])
          return
        }
        console.log('User logged in, fetching tags from database...')

        const { data, error } = await supabase
          .from('post_categories')
          .select('category_id, title')
          .order('title', { ascending: true })
        if (error) {
          console.error('Error fetching tags:', error)
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          setAvailableTags([])
        } else if (data) {
          console.log('Tags fetched successfully:', data, availableTags)
          // const tagTitles = (data as { title: string }[]).map(
          //   (tag) => tag.title
          // )
          // 过滤掉 title 为 null 的项（如果需要）
          setAvailableTags(data as Category[])
        } else {
          console.warn('No data returned from tags query')
          setAvailableTags([])
        }
      } catch (error) {
        console.error('Unexpected error fetching initial tags:', error)
        console.error('Error type:', typeof error)
        console.error(
          'Error stack:',
          error instanceof Error ? error.stack : 'No stack trace'
        )
        setAvailableTags([])
      } finally {
        setTagsLoading(false)
      }
    }
    fetchTags()
  }, [])

  // 新增标签
  const addNewTag = async (tag: Category) => {
    const tagsToInsert = {
      title: tag.title,
      category_id: tag.category_id,
      create_time: tag.create_time,
      update_time: tag.update_time || tag.create_time
    }
    const { error: insertTagsError } = await supabase
      .from('post_categories')
      .upsert(tagsToInsert, { onConflict: 'title' })
    if (insertTagsError) {
      return showToast(insertTagsError?.message, 'error')
    }
    showToast('保存成功!', 'success')
    //
  }
  return {
    availableTags,
    tagsLoading,
    addNewTag
  }
}
