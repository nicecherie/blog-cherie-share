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
      console.log('session', session)

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

        const { data, error } = await supabase.from('tags').select('*')

        console.log('data', data)
      } catch (error) {
      } finally {
        setTagsLoading(false)
      }
    }
    fetchTags()
  }, [])

  const addNewTag = () => {}
  return {
    availableTags,
    tagsLoading,
    addNewTag
  }
}
