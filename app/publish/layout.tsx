'use client'

import { useTags } from '@/lib/hooks/use-tags'
import CollapsibleForm from './components/collapsible-form'
import { useEffect, useState } from 'react'
import { useArticleData } from '@/lib/hooks/use-article-data'
import { EditorProvider, useEditor } from './context'
import { useSearchParams } from 'next/navigation'

import { SaveButton } from './components/save-button'
const PublishContent = ({ children }: { children: React.ReactElement }) => {
  const { content, setContent, isSaving, setIsSaving } = useEditor()
  const searchParams = useSearchParams()
  const editSlug = searchParams.get('edit')
  const {
    articleData,
    isEditing,
    updateArticleData,
    handleNewTagCreated,
    handleSave
  } = useArticleData({
    editSlug,
    content,
    setContent,
    setIsSaving
  })
  const [collapsed, setCollapsed] = useState(true)
  const { availableTags, tagsLoading, addNewTag } = useTags()
  const [githubUrl, setGithubUrl] = useState(articleData.github_url ?? '')
  useEffect(() => {
    if (articleData.github_url) {
      setGithubUrl(articleData.github_url)
    }
  }, [articleData.github_url])

  const handleGithubUrlChange = (value: string) => {
    setGithubUrl(value)
    updateArticleData('github_url', value)
  }

  const handleNewTagCreatedWithUpdate = (tag: string) => {
    addNewTag(tag)
    handleNewTagCreated(tag)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 提交表单
    await handleSave(e)
  }
  return (
    <div className="min-h-screen">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <CollapsibleForm
            collapsed={collapsed}
            isEditing={false}
            title={articleData.title}
            date={articleData.date}
            author={articleData.author}
            visibility={articleData.visibility}
            readTime={articleData.readTime}
            tags={articleData.tags}
            availableTags={availableTags}
            tagsLoading={tagsLoading}
            editSlug={editSlug}
            githubUrl={githubUrl}
            onGithubUrlChange={handleGithubUrlChange}
            onCollapsedChange={setCollapsed}
            onTitleChange={(val) => updateArticleData('title', val)}
            onVisibilityChange={(val) => updateArticleData('visibility', val)}
            onDateChange={(val) => updateArticleData('date', val)}
            onAuthorChange={(val) => updateArticleData('author', val)}
            onReadTimeChange={(val) => updateArticleData('readTime', val)}
            onTagsChange={(val) => updateArticleData('tags', val)}
            onNewTagCreated={handleNewTagCreatedWithUpdate}
          />
          {/* markdown */}
          <h2 className="text-lg font-semibold">文章正文编辑</h2>
          <div className="bg-card">{children}</div>
          <SaveButton isSaving={isSaving} />
        </form>
      </div>
    </div>
  )
}

const PublishLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <EditorProvider>
      {/* // TODO: add a loading state */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <PublishContent>{children}</PublishContent>
        </div>
      </div>
    </EditorProvider>
  )
}

export default PublishLayout
