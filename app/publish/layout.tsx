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
  const id = searchParams.get('id')

  const { articleData, updateArticleData, handleSave, isLoaded } =
    useArticleData({
      id,
      editSlug,
      setIsSaving,
      content,
      setContent
    })

  const [collapsed, setCollapsed] = useState(true)
  const { availableTags, tagsLoading, addNewTag } = useTags()

  const [githubUrl, setGithubUrl] = useState('')
  useEffect(() => {
    setGithubUrl(articleData.github_url ?? '')
  }, [articleData.github_url])

  const handleGithubUrlChange = (value: string) => {
    setGithubUrl(value)
    updateArticleData('github_url', value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSave(e)
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
            readTime={articleData.readTime as number}
            tags={articleData.tags}
            availableTags={availableTags}
            tagsLoading={tagsLoading}
            editSlug={editSlug}
            githubUrl={githubUrl}
            onGithubUrlChange={handleGithubUrlChange}
            onCollapsedChange={setCollapsed}
            onTitleChange={(val) => updateArticleData('title', val)}
            onVisibilityChange={(val) =>
              updateArticleData('visibility', val as 'public' | 'private')
            }
            onDateChange={(val) => updateArticleData('date', val)}
            onAuthorChange={(val) => updateArticleData('author', val)}
            onReadTimeChange={(val) =>
              updateArticleData('readTime', val as number)
            }
            onTagsChange={(val) => updateArticleData('tags', val)}
          />
          <div className="bg-card mt-2">{children}</div>
          <SaveButton isSaving={isSaving} />
        </form>
      </div>
    </div>
  )
}

const PublishLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <EditorProvider>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <PublishContent>{children}</PublishContent>
        </div>
      </div>
    </EditorProvider>
  )
}

export default PublishLayout
