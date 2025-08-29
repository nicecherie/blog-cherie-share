'use client'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  const [plainText, setPlainText] = useState('')

  useEffect(() => {
    const extractTextFromHTML = (htmlString: string) => {
      const div = document.createElement('div')
      div.innerHTML = htmlString
      return div.textContent || div.innerText || ''
    }

    setPlainText(extractTextFromHTML(post.content))
  }, [post.content])
  // 生成60-150之间的随机数
  const randomLength = Math.floor(Math.random() * (150 - 60 + 1)) + 60
  return (
    <Card className="flex flex-col h-fit">
      <CardHeader>
        <div className="text-sm text-muted-foreground mb-1">
          {formatDate(post.created_at)} · {author}
        </div>
        <h1>{post.title}</h1>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-5 md:line-clamp-3">
          {/* content 中包含了 html 标签，如何处理 */}
          {/* 生成 60-150 的随机数去截取 content */}
          {/* 截取后的内容 */}
          {plainText.substring(0, randomLength)}
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
