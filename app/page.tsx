import { createServerClient } from '@/lib/supabase/server'
import PostsList from '@/components/posts-list'

export default async function Home() {
  const supabase = createServerClient()
  const pageSize = 6
  const { data, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, pageSize - 1)

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PostsList
        initialPosts={data ?? []}
        totalCount={count ?? 0}
        pageSize={pageSize}
      />
    </div>
  )
}
