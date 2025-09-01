'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'

interface PostsResponse {
  items: Post[]
  total: number
}

export default function BlogPost() {
  const { user } = useAuth()
  const supabase = getSupabaseClient()

  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // 拉取文章
  const fetchPosts = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data: postsData, error } = await supabase.rpc(
      'get_posts_with_category',
      {
        search: debouncedSearch || null,
        limit_count: 10,
        offset_count: page * 10
      }
    )
    if (!error && postsData) {
      const result = postsData as PostsResponse
      setPosts(result.items)
      setTotalCount(result.total)
      setTotalPages(Math.ceil(result.total / 10))
    }
    setLoading(false)
  }, [user, supabase, debouncedSearch, page])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 删除文章
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id))
      setTotalCount((prev) => prev - 1)

      if (posts.length === 1 && page > 0) {
        // 删除后当前页为空 → 翻回上一页
        setPage((p) => p - 1)
      } else {
        // 刷新当前页
        fetchPosts()
      }
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">请先登录后再管理文章</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Input
            id="search"
            type="text"
            placeholder="搜索文章..."
            value={search}
            onChange={(e) => {
              setPage(0) // 搜索时重置分页
              setSearch(e.target.value)
            }}
            className="w-64"
          />
        </div>
        <Link href="/publish">
          <Button>新建文章</Button>
        </Link>
      </div>

      {/* 表格 */}
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  {loading ? '加载中...' : '暂无文章'}
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow
                  key={post.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => (window.location.href = `/blog/${post.id}`)}
                >
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.categories.map((c) => c.title).join(', ') || '-'}
                  </TableCell>
                  <TableCell>{formatDate(post.created_at)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link
                      href={`/publish?id=${post.id}&edit=${post.title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" size="sm">
                        编辑
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(post.id)
                      }}
                    >
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      <div className="flex justify-between mt-4 space-x-2">
        <div className="flex gap-5 text-sm text-muted-foreground">
          <p>
            第 {page + 1} / {totalPages || 1} 页
          </p>
          <p>共 {totalCount} 篇文章</p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={loading || posts.length < 10}
            onClick={() => setPage((p) => p + 1)}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  )
}
