import { BlogPostCard } from '@/components/blog-post-card'
import { createServerClient } from '@/lib/supabase/server'

async function getPostsByCategory(id: string) {
  const supabase = createServerClient()

  // const { data: posts, error } = await supabase
  //   .from('post_categories')
  //   .select('*,posts(*)')
  //   .contains('tags', [title])
  const { data: posts, error } = await supabase.rpc('get_posts_by_category', {
    cid: id
  })
  console.log('posts', posts)
  if (error) {
    console.log('error', error)
    return []
  }
  if (!posts || posts.length === 0) return []
  return posts
}
interface Post {
  id: string
  title: string
  content: string
  created_at: string
  author_name: string
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post: Post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
