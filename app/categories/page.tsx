import { createServerClient } from '@/lib/supabase/server'

export default async function Categories() {
  const supbase = createServerClient()
  // 获取10篇文章
  const { data: posts } = await supbase.from('posts').select('*').limit(10)

  // todo: 设计categories 数据表和 posts 关联
  // 1. 请求这个 post_category 表，随便来 10条数据
  // 2. 根据 post_category，请求 posts 表
  // 参考网站：https://www.zyzy.info/categories/%E5%85%A8%E6%A0%88

  return (
    <div className="container mx-auto px-4 py-8">
      <section>
        <h1>我的博客</h1>
      </section>

      <div>{posts?.map((post) => JSON.stringify(post))}</div>
    </div>
  )
}
