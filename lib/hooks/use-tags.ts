'use client'

import { useEffect, useState } from 'react'
import { getSuabaseClient } from '../supabase/client'

export const useTags = () => {
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [tagsLoading, setTagsLoading] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      const supabase = getSuabaseClient()
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
          .select('title')
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
          console.log('Tags fetched successfully:', data)
          const tagTitles = (data as { title: string }[]).map(
            (tag) => tag.title
          )
          setAvailableTags(tagTitles)
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

  const addNewTag = (newTag: string) => {
    if (!availableTags.includes(newTag)) {
      setAvailableTags([...availableTags, newTag].sort())
    }
  }
  return {
    availableTags,
    tagsLoading,
    addNewTag
  }
}
