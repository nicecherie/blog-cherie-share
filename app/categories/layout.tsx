'use client'
import Multiselect from '@/components/multi-select'
import { useTags } from '@/lib/hooks/use-categories'
import { Button } from '@/components/ui/button'
import { Category, Post } from '@/types'
import { useState } from 'react'

const AddCate = () => {
  const { availableTags, tagsLoading, addNewTag } = useTags()
  const [categories, setCategories] = useState<Category[]>([])
  const onTagsChange = (opt: Category[]) => {
    setCategories(opt)
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <section>
        <h1>添加分类</h1>
      </section>

      <Multiselect
        options={availableTags}
        value={categories}
        tagsLoading={tagsLoading}
        onTagsChange={onTagsChange}
        onNewTagCreated={addNewTag}
      ></Multiselect>
    </div>
  )
}

const CategoriesLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <AddCate />
      {children}
    </div>
  )
}

export default CategoriesLayout
