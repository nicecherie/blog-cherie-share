import { Post } from '@/types'

interface BlogPostProps {
  post: Post
}

const BlogPostPage = ({ post }: BlogPostProps) => {
  return (
    <>
      <div className="container mx-auto">BlogPostPage</div>
      <div className="toc"></div>
    </>
  )
}

export default BlogPostPage
