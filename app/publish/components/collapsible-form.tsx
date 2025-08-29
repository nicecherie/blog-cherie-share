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
import { LuChevronUp, LuChevronDown } from 'react-icons/lu'
import { CollapsibleFormProps, ArticleFormProps, Category } from '@/types'
import Multiselect from '@/components/multi-select'
import { useTags } from '@/lib/hooks/use-categories'
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
  onTagsChange
}: CollapsibleFormProps) {
  const { availableTags, tagsLoading, addNewTag } = useTags()
  const handleRadioChange = (value: string) => {
    onVisibilityChange(value as 'private' | 'public')
  }

  return (
    <Card className="max-w-7xl mx-auto">
      <Collapsible
        className="CollapsibleRoot"
        open={collapsed}
        onOpenChange={onCollapsedChange}
      >
        <CardHeader className="flex flex-row items-center justify-between bg-ring text-white p-1 rounded-t-sm">
          <CardTitle className="mt-2">文章信息设置</CardTitle>
          <CollapsibleTrigger asChild>
            <button className="IconButton">
              {collapsed ? <LuChevronUp /> : <LuChevronDown />}
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-2 grid md:grid-cols-2 auto-rows-max gap-4 ">
            <div className="space-y-2 form-items">
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
            <div className="space-y-2 form-items">
              <Label htmlFor="title">类别</Label>

              <Multiselect
                options={availableTags}
                value={tags}
                tagsLoading={tagsLoading}
                onNewTagCreated={addNewTag}
                onTagsChange={onTagsChange}
              />
            </div>
            <div className="space-y-2 form-items">
              <Label htmlFor="visibility">可见性</Label>
              <RadioGroup
                value={visibility}
                onValueChange={handleRadioChange}
                className="radio-group"
              >
                <div className="flex items-center space-x-2 gap-2 text-muted dark:text-muted-foreground">
                  <RadioGroupItem
                    value="private"
                    id="private"
                    className="radio-item flex-1"
                  />
                  <Label htmlFor="private">私有 - 仅登录用户可见</Label>
                </div>
                <div className="flex items-center space-x-2 gap-2 text-muted dark:text-muted-foreground">
                  <RadioGroupItem
                    value="public"
                    id="public"
                    className="radio-item flex-1"
                  />
                  <Label htmlFor="public">公开 - 所有人可见</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2 form-items">
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
            <div className="space-y-2 form-items">
              <Label htmlFor="title">日期</Label>
              <Input
                id="date"
                placeholder="输入日期"
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
              />
            </div>
            <div className="space-y-2 form-items">
              <Label htmlFor="title">作者</Label>
              <Input
                id="text"
                placeholder="请输入作者名"
                type="text"
                value={author}
                onChange={(e) => onAuthorChange(e.target.value)}
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
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
