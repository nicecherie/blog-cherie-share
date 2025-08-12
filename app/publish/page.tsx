'use client'

import { Post } from '@/types'
import { Suspense } from 'react'
import RichTextEditor from './components/rich-text-editor'
import { useEditor } from './context'

export default function Publish({ post }: { post: Post }) {
  const { content, setContent } = useEditor()
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RichTextEditor content={content} onChange={setContent}></RichTextEditor>
    </Suspense>
  )
}
