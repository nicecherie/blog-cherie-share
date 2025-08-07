'use client'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/Lable'
import { Textarea } from '@/components/ui/textarea'
import { getSuabaseClient } from '@/lib/supabase/client'
import { Post } from '@/types'
import type { Category } from '@/types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { LuChevronUp, LuChevronDown } from 'react-icons/lu'

export default function Publish({ post }: { post: Post }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setcontent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [published, setPublished] = useState(false)
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const { user } = useAuth()
  const supabase = getSuabaseClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO: 未登录跳转登录页面
    if (!user) {
      return
    }
    // TODO: 表单校验

    // 保存提交
    try {
      // 生成唯一标识
      const slug =
        title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '') +
        '-' +
        Date.now().toString().slice(-6)

      // 创建文章
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          slug,
          content,
          excerpt,
          author_id: user.id,
          published: true,
          is_public: true
        })
        .select()

      if (error) {
        throw error
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
    console.log('title', title)
  }
  return (
    <Card className="max-w-7xl mx-auto">
      <Collapsible
        className="CollapsibleRoot"
        open={open}
        onOpenChange={setOpen}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex-1">Publish new article</CardTitle>
          <CollapsibleTrigger asChild>
            <button className="IconButton">
              {open ? <LuChevronUp /> : <LuChevronDown />}
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CardContent>
          <CollapsibleContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  placeholder="输入文章标题"
                  type="title"
                  required
                  value={title}
                  disabled={isLoading}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">摘要 (可选)</Label>
                <Textarea
                  id="excerpt"
                  placeholder="excerpt"
                  required
                  value={excerpt}
                  disabled={isLoading}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                提交
              </Button>
            </form>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  )
}
