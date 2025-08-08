'use client'

import CollapsibleForm from './components/collapsible-form'
import { useState } from 'react'
const PublishContent = ({ children }: { children: React.ReactElement }) => {
  const [collapsed, setCollapsed] = useState(true)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  return (
    <div className="min-h-screen">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <CollapsibleForm
            collapsed={collapsed}
            isEditing={false}
            title=""
            date=""
            author=""
            readTime=""
            tags={[]}
            availableTags={[]}
            tagsLoading={false}
            editSlug=""
            githubUrl=""
            onGithubUrlChange={() => {}}
            onCollapsedChange={() => {}}
            onTitleChange={() => {}}
            onDateChange={() => {}}
            onAuthorChange={() => {}}
            onReadTimeChange={() => {}}
            onTagsChange={() => {}}
            onNewTagCreated={() => {}}
          />
          {/* markdown */}
          <div className="bg-card">{children}</div>
        </form>
      </div>
    </div>
  )
}

const PublishLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <PublishContent>{children}</PublishContent>
      </div>
    </div>
  )
}

export default PublishLayout
