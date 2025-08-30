'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlogPostCard } from '@/components/blog-post-card'
import { Button } from '@/components/ui/button'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Pagination } from '@/components/ui/pagination'
import { useLoading } from './loading'

interface PostsListProps {
  initialPosts: any[]
  totalCount: number
  pageSize?: number
}

export default function PostsList({
  initialPosts,
  totalCount,
  pageSize = 12
}: PostsListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [sort, setSort] = useState<'latest' | 'oldest' | 'updated'>('latest')
  const [page, setPage] = useState(1)
  const { isLoading, setIsLoading } = useLoading()

  const totalPages = Math.ceil(totalCount / pageSize)

  // 只有当 page 或 sort 变化时才触发请求
  const fetchPosts = useCallback(async () => {
    setIsLoading(true)

    const supabase = getSupabaseClient()
    let query = supabase.from('posts').select('*')

    // 排序规则
    if (sort === 'latest') {
      query = query.order('created_at', { ascending: false })
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true })
    } else if (sort === 'updated') {
      query = query.order('updated_at', { ascending: false })
    }

    // 分页范围
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    // 包装异步请求
    const { data, error } = await query

    if (error) {
      console.error(error)
      return
    }
    setPosts(data ?? [])
    setIsLoading(false)
  }, [page, sort, pageSize]) // 依赖只包括 page 和 sort

  // 只在 page 或 sort 变化时触发请求
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts]) // 使用 fetchPosts，确保其依赖变化时才触发

  const handleSort = (sortKey: 'latest' | 'oldest' | 'updated') => {
    if (sortKey === 'latest') {
      // 直接还原首屏数据
      setPosts(initialPosts)
    }
    setSort(sortKey)
    setPage(1) // 重置到第一页
  }

  return (
    <div>
      {/* 排序 */}
      <section className="mb-4 flex gap-2 items-center">
        <span>排序方式：</span>
        <Button
          variant={sort === 'latest' ? 'default' : 'outline'}
          onClick={() => handleSort('latest')}
        >
          最新发布
        </Button>
        <Button
          variant={sort === 'oldest' ? 'default' : 'outline'}
          onClick={() => handleSort('oldest')}
        >
          最早发布
        </Button>
        <Button
          variant={sort === 'updated' ? 'default' : 'outline'}
          onClick={() => handleSort('updated')}
        >
          最近修改
        </Button>
      </section>

      {/* 文章列表 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </section>

      {/* 分页 */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
