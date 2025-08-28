'use client'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

import { Post } from '@/types'
interface BlogPostCardProps {
  post: Post
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const author =
    post.author?.display_name || post.author?.username || '未知作者'

  const extractTextFromHTML = (htmlString: string) => {
    const div = document.createElement('div')
    div.innerHTML = htmlString
    return div.textContent || div.innerText || ''
  }
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="text-sm text-muted-foreground mb-1">
          {formatDate(post.created_at)} · {author}
        </div>
        <h1>{post.title}</h1>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">
          {/* content 中包含了 html 标签，如何处理 */}
          {extractTextFromHTML(post.content).substring(0, 60) + '...'}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${post.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            阅读全文
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
