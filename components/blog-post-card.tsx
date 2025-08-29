'use client'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Post } from '@/types'

interface BlogPostCardProps {
  post: Post
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const author =
    post.author_name ||
    post.author?.display_name ||
    post.author?.username ||
    '未知作者'

  const [excerpt, setExcerpt] = useState('')

  useEffect(() => {
    const extractTextFromHTML = (htmlString: string) => {
      const div = document.createElement('div')
      div.innerHTML = htmlString
      return div.textContent || div.innerText || ''
    }

    const plainText = extractTextFromHTML(post.content).trim()
    const maxLength = 160
    setExcerpt(
      plainText.slice(0, maxLength) +
        (plainText.length > maxLength ? '...' : '')
    )
  }, [post.content])

  return (
    <Link href={`/blog/${post.id}`} className="block break-inside-avoid mb-6">
      <Card
        className="group flex flex-col rounded-2xl bg-background 
                   border border-border/40 shadow-sm
                   cursor-pointer transition-all duration-300 
                   hover:shadow-lg hover:-translate-y-1 active:scale-95"
      >
        <CardHeader className="space-y-2">
          {/* 日期 + 作者 */}
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>{formatDate(post.created_at)}</span>
            <span>·</span>
            <span>{author}</span>
          </div>

          {/* 标题 */}
          <h2
            className="text-xl font-semibold tracking-tight 
                       text-foreground group-hover:text-primary transition-colors"
          >
            {post.title}
          </h2>
        </CardHeader>

        {/* 摘要 */}
        <CardContent>
          <p className="text-muted-foreground leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
