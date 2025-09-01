import { BlogPostCard } from '@/components/blog-post-card'
import { createServerClient } from '@/lib/supabase/server'
import { Post } from '@/types'
async function getPostsByCategory(id: string) {
  const supabase = createServerClient()

  const { data: posts, error } = await supabase.rpc('get_posts_by_category', {
    cid: id
  })
  if (error) {
    console.log('error', error)
    return []
  }
  if (!posts || posts.length === 0) return []
  return posts
}
export default async function CategoryPage({
  params
}: {
  params: { id: string }
}) {
  // 路由参数必须先使用 await 获取
  const { id: cateId } = await params
  const posts = await getPostsByCategory(cateId)
  return (
    <div className="container mx-auto">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {posts.map((post: Post) => (
          <BlogPostCard key={post.id} post={post as Post} />
        ))}
      </div>
    </div>
  )
}
