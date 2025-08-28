// 'use client'
import { createServerClient } from '@/lib/supabase/server'
import { Category, Post } from '@/types'
import Link from 'next/link'
import AddCate from './add-cate'

interface categoriesPost extends Category {
  posts: Post[]
}
async function getCategories() {
  const supabase = createServerClient()

  // const { data: categories, error } = await supabase.from('post_categories')
  //   .select(`
  //   category_id,
  //   title,
  //   cate_post_rel (
  //     posts (
  //       id,
  //       title,
  //       content
  //     )
  //   )
  // `)
  const { data: categories, error } = await supabase.rpc(
    'get_categories_with_posts'
  )
  // categories 按照 posts 字段的 length 长度排序
  // @ts-ignore
  categories.sort((a, b) => b.posts.length - a.posts.length)
  if (error) {
    console.log('error', error)
    return []
  }
  console.log('categories', categories)

  return categories as categoriesPost[]
}

export default async function Categories() {
  const categories = await getCategories()
  return (
    <div className="container mx-auto px-4 py-5">
      <AddCate />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((cate) => (
          <Link key={cate.category_id} href={`/categories/${cate.category_id}`}>
            <div className="cursor-pointer bg-card hover:shadow-sm shadow-ring p-6 rounded-lg group">
              <h2 className="text-xl text-ring mb-3 font-bold group-hover:text-ring-foreground">
                {cate.title}
              </h2>
              <span className="text-sm text-muted-foreground">
                共 {cate.posts?.length} 篇文章
              </span>
              {/* <div className="all">{JSON.stringify(cate)}</div> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
