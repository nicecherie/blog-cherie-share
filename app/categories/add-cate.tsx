'use client'
import { useTags } from '@/lib/hooks/use-categories'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { v4 as uuid } from 'uuid'
import { useAuth } from '@/components/auth-provider'
import { isAdmin } from '@/lib/auth-config'
import { useRouter } from 'next/navigation'
const AddCate = () => {
  const router = useRouter()
  const { user } = useAuth()
  const is_admin = isAdmin(user)
  const { addNewTag } = useTags()
  const [category, setCategory] = useState('')
  const addCate = async () => {
    if (!category.trim()) return setCategory('')
    const cate = {
      category_id: uuid(),
      title: category,
      create_time: new Date().toISOString()
    }
    await addNewTag(cate)
    setCategory('')
    router.refresh()
  }
  return (
    <>
      <div
        className={`container mx-auto px-4 py-8 flex justify-end ${
          is_admin ? '' : 'hidden'
        }`}
      >
        <Input
          className="w-50 rounded-r-none"
          id="category"
          placeholder="请输入类别"
          type="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        ></Input>
        <Button className="rounded-l-none" type="button" onClick={addCate}>
          添加类别
        </Button>
      </div>
    </>
  )
}

export default AddCate
