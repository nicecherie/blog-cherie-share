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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function CollapsibleForm({
  collapsed,
  isEditing,
  title,
  date,
  visibility,
  author,
  readTime,
  tags,
  editSlug,
  githubUrl,
  onVisibilityChange,
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
  const [isPrivate, setIsPrivate] = useState('private')
  const handleRadioChange = (value: string) => {
    console.log(value, 'event')
    // const target = event.target as HTMLInputElement;
    //     onVisibilityChange(target)
  }
  return (
    <Card className="max-w-7xl mx-auto">
      <Collapsible
        className="CollapsibleRoot"
        open={collapsed}
        onOpenChange={onCollapsedChange}
      >
        <CardHeader className="flex flex-row items-center justify-between bg-ring text-white p-1 rounded-t-sm">
          <CardTitle className="flex-1 ">文章信息设置</CardTitle>
          <CollapsibleTrigger asChild>
            <button className="IconButton">
              {collapsed ? <LuChevronUp /> : <LuChevronDown />}
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 ">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              placeholder="输入文章标题"
              type="title"
              required
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">类别</Label>
            <TagsMultiselect
              options={availableTags}
              value={tags}
              tagsLoading={tagsLoading}
              onTagsChange={onTagsChange}
              onNewTagCreated={onNewTagCreated}
            />
          </div>
          <div className="space-y-2">
            <Label>可见性</Label>
            <RadioGroup value={isPrivate} onValueChange={handleRadioChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" />
                <Label htmlFor="private">私有 - 仅登录用户可见</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" />
                <Label htmlFor="public">公开 - 所有人可见</Label>
              </div>
            </RadioGroup>
          </div>
          <CollapsibleContent>
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
            {/* <Button className="w-full" type="submit">
              提交
            </Button> */}
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  )
}
