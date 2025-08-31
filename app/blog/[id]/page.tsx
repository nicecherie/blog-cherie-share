import RichTextPreview from '@/components/rich-text/rich-text-preview'
import { createServerClient } from '@/lib/supabase/server'
import { Post } from '@/types'

// 扩展 PageProps
interface BlogPostPageProps {
  params: { id: string }
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { id } = params
  const supabase = createServerClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  return (
    <div className="container mx-auto">
      {post && <RichTextPreview {...(post as Post)} />}
      <div className="toc"></div>
    </div>
  )
}

export default BlogPostPage
