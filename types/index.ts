export interface Post {
  id: string
  title: string
  slug: string
  content: string
  // excerpt: string | null
  // author_id: string
  // published: boolean
  // is_public: boolean
  visibility: 'public' | 'private'
  read_time: number
  github_url?: string
  created_at: string
  updated_at?: string
  tags?: Category[]
  author?: User
  author_name: string
  categories: Category[]
}

export interface User {
  id: string
  email?: string
  username?: string
  display_name?: string
  avatar_url?: string
  bio?: string
}

export interface Category {
  category_id: string | number
  title: string
  create_time?: string
  update_time?: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: User
}

export interface ArticleFormProps {
  title: string
  date: string
  author: string
  visibility: 'public' | 'private'
  readTime: number | ''
  tags: Category[]
  availableTags: string[]
  tagsLoading: boolean
  editSlug: string | null
  githubUrl: string
  onVisibilityChange: (value: string) => void
  onGithubUrlChange: (value: string) => void
  onTitleChange: (value: string) => void
  onDateChange: (value: string) => void
  onAuthorChange: (value: string) => void
  onReadTimeChange: (value: number | '') => void
  onTagsChange: (value: Category[]) => void
}

export interface CollapsibleFormProps extends ArticleFormProps {
  collapsed: boolean | true
  isEditing: boolean
  onCollapsedChange: (value: boolean) => void
}
