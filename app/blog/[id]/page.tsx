import RichTextPreview from '@/components/rich-text/rich-text-preview'
import { createServerClient } from '@/lib/supabase/server'

import { Post } from '@/types'
interface BlogPostProps {
  params: { id: string }
}

const BlogPostPage = async ({ params }: BlogPostProps) => {
  const { id } = await params
  const supabase = createServerClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  console.log(post, 'post')

  return (
    <>
      <div className="container mx-auto">
        <RichTextPreview {...(post as Post)}></RichTextPreview>
      </div>
      <div className="toc"></div>
    </>
  )
}

export default BlogPostPage
