'use client'

import { Post } from '@/types'
import { Suspense } from 'react'
import RichTextEditor from './components/rich-text-editor'
export default function Publish({ post }: { post: Post }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RichTextEditor></RichTextEditor>
    </Suspense>
  )
}
