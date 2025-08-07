import { BlogPostCard } from '@/components/blog-post-card'
import { createServerClient } from '@/lib/supabase/server'

async function getPosts() {
  const supabase = createServerClient()

  const { data: posts, error } = await supabase.from('posts').select('*')
  console.log('posts', posts)
  return posts
}
export default async function Home() {
  const posts = await getPosts()
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <section>
        <h1>我的博客</h1>
      </section>
    </div>
  )
}
