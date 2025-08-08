'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/Lable'
import { Textarea } from '@/components/ui/textarea'
import { LuChevronUp, LuChevronDown } from 'react-icons/lu'
import { useState } from 'react'
import { CollapsibleFormProps, ArticleFormProps, Category } from '@/types'
import TagsMultiselect from '@/components/tags-multiselect'
import { useTags } from '@/lib/hooks/use-tags'

export default function CollapsibleForm({
  collapsed,
  isEditing,
  title,
  date,
  author,
  readTime,
  tags,
  editSlug,
  githubUrl,
  onGithubUrlChange,
  onCollapsedChange,
  onTitleChange,
  onDateChange,
  onAuthorChange,
  onReadTimeChange,
  onTagsChange,
  onNewTagCreated
}: CollapsibleFormProps) {
  const { availableTags, tagsLoading, addNewTag } = useTags()
  console.log('availableTags', availableTags)
  console.log('addNewTag', addNewTag)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: 提交表单
  }
  return (
    <Card className="max-w-7xl mx-auto">
      <Collapsible
        className="CollapsibleRoot"
        open={collapsed}
        onOpenChange={onCollapsedChange}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex-1">Publish new article</CardTitle>
          <CollapsibleTrigger asChild>
            <button className="IconButton">
              {collapsed ? <LuChevronUp /> : <LuChevronDown />}
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
                  disabled={tagsLoading}
                  onChange={(e) => onTitleChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">日期</Label>
                <Input
                  id="date"
                  placeholder="输入日期"
                  type="date"
                  value={date}
                  onChange={(e) => onDateChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">作者</Label>
                <Input
                  id="text"
                  placeholder="请输入作者名"
                  type="text"
                  value={author}
                  onChange={(e) => onAuthorChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">预计阅读时间(分钟)</Label>
                <Input
                  id="number"
                  type="number"
                  value={readTime}
                  onChange={(e) =>
                    onReadTimeChange(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  placeholder="如：5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">标签</Label>
                <TagsMultiselect
                  options={tags}
                  value={availableTags}
                  tagsLoading={tagsLoading}
                  onTagsChange={onTagsChange}
                  onNewTagCreated={onNewTagCreated}
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="title">摘要 (可选)</Label>
                <Textarea
                  id="excerpt"
                  placeholder="excerpt"
                  required
                  value={excerpt}
                  disabled={isLoading}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div> */}
              {/* <Button className="w-full" type="submit" disabled={isLoading}>
                提交
              </Button> */}
            </form>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  )
}
